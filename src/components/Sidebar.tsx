import plusIcon from "/plus.svg";
import signupIcon from "/signup.svg";
import bell from "/bell.svg";
import ShadowButton from "./ShadowButton";
import { getEnrolledCourses } from "../services/api";
import type { JSX } from "react";
import Spinner from "./Spinner";
import TransparentLink from "./TransparentLink";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
    const {data: courses, isLoading, isError} = useQuery({
        queryFn: getEnrolledCourses,
        queryKey: ["courses"]
    })

    let content: JSX.Element | null = null

    if (isLoading) {
        content = <Spinner />;
    }
    else if (isError) {
        content = <p className="text-red-500">Error.</p>;
    }
    else if (!courses || courses.length === 0) {
        content = <p>No courses found.</p>;
    }
    else {
        content = (
            <ul>
                {courses.map(c => (
                    <li key={c.id}>
                        <TransparentLink to="/home" text={c.name} />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="flex flex-col bg-transparent h-full w-44 p-3">
            <div className="flex flex-col gap-2 mb-4">  
                <ShadowButton
                    iconSrc={plusIcon}
                    text="New course"
                />
                <ShadowButton
                    iconSrc={signupIcon}
                    text="Join course"
                />
                <TransparentLink
                    to="/home/notifications"
                    iconSrc={bell}
                    text="Notifications"
                />
                
                <span className="text-secondary-grey font-semibold select-none mt-2 text-left w-full block">
                    My courses
                </span>
            </div>
            <div className="flex-1 pr-1 overflow-y-auto">
                
                {content}

                {/* TODO: Add here list of courses using transparent button */}
            </div>
        </div>
    )
}

export default Sidebar

