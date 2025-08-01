import { useQuery } from "@tanstack/react-query";
import { useContext, type JSX } from "react";
import { UserContext } from "../routes/home/route";
import { getEnrolledCourses } from "../services/api";
import ShadowLink from "./ShadowLink";
import Spinner from "./Spinner";
import TransparentLink from "./TransparentLink";
import bell from "/bell.svg";
import plusIcon from "/plus.svg";
import signupIcon from "/signup.svg";

interface SidebarProps {
    onCourseClick: (courseId: number, courseOwnerId: string) => void;
}

const Sidebar = ({ onCourseClick }: SidebarProps) => {
    const userContext = useContext(UserContext)!;

    const {data: courses, isLoading, error } = useQuery({
        queryKey: ["courses"],
        queryFn: () => getEnrolledCourses(),
    })

    let content: JSX.Element | null = null

    if (isLoading) {
        content = <Spinner />;
    }
    else if (error) {
        content = <p className="text-red-500 font-bold text-center mt-8">Error - {error.message}</p>;
    }
    else if (!courses || courses.length === 0) {
        content = <p className="text-white italic">No courses found.</p>;
    }
    else {
        content = (
            <ul>
                {courses.map(c => (
                    <li key={c.id}>
                        <TransparentLink 
                            to="/home/courses/$courseId"
                            params={{
                                courseId: c.id.toString()
                            }}
                            onClick={() => onCourseClick(c.id, c.ownerId)}
                            text={c.name}
                         />
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="flex flex-col bg-transparent h-full w-44 p-3">
            <div className="flex flex-col gap-2 mb-4">  
                {userContext.role === "Teacher" && <ShadowLink
                    to="/home/courses/new"
                    iconSrc={plusIcon}
                    text="New course"
                />}
                <ShadowLink
                    iconSrc={signupIcon}
                    text="Join course"
                    to="/home/available-courses"
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
            </div>
        </div>
    )
}

export default Sidebar

