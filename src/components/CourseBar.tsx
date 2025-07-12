import { useQuery } from "@tanstack/react-query";
import type { BasicLectureInfo } from "../types/lecture";
import TransparentButton from "./TransparentButton"
import TransparentLink from "./TransparentLink";
import { getAssignmentsByCourseId, getLecturesByCourseId, getMembersByCourseId } from "../services/api";
import { useContext, useEffect, useState } from "react";
import type { BasicAssignmentInfo } from "../types/assignment";
import type { BasicUserInfo } from "../types/user";
import { useRouter } from "@tanstack/react-router";
import { UserContext } from "../routes/home/route";

interface CourseBarProps {
    currentCourseId: number | null;
    currentCourseName: string | null
}

type Tab = "lectures" | "assignments" | "members";

const CourseBar = ({ currentCourseId, currentCourseName }: CourseBarProps) => {
    const router = useRouter();
    const userContext = useContext(UserContext)!;

    const [currentTab, setCurrentTab] = useState<Tab>("lectures")
    const [currentData, setCurrentData] = useState<
        BasicLectureInfo[]
        | BasicAssignmentInfo[]
        | BasicUserInfo[]
    >([])

    const { data: lectures } = useQuery({
        queryKey: ["lectures", currentCourseId],
        queryFn: () => getLecturesByCourseId(currentCourseId!),
        enabled: currentCourseId !== null && currentTab === "lectures",
        staleTime: 60_000 * 5
    })

    const { data: assignments } = useQuery({
        queryKey: ["assignments", currentCourseId],
        queryFn: () => getAssignmentsByCourseId(currentCourseId!),
        enabled: currentCourseId !== null && currentTab === "assignments",
        staleTime: 60_000 * 5
    })

    const { data: members } = useQuery({
        queryKey: ["members", currentCourseId],
        queryFn: () => getMembersByCourseId(currentCourseId!),
        enabled: currentCourseId !== null && currentTab === "members",
        staleTime: 60_000 * 5
    })

    useEffect(() => {
        if (currentTab == "lectures") setCurrentData(lectures || []);
        else if (currentTab == "assignments") setCurrentData(assignments || []);
        else if (currentTab == "members") setCurrentData(members || []);
    }, [currentTab, lectures, assignments, members])

    const tabs = ["Lectures", "Assignments", "Members"];

    return (
        <div className="flex flex-col bg-black/20 rounded-2xl h-full w-72 op-0 bottom-0 left-0 p-5 overflow-y-auto">
            <span className="font-bold text-xl text-secondary-grey select-none whitespace-nowrap text-ellipsis pb-2 border-b border-secondary-grey border-2/20">
                {currentCourseName || ""}
            </span>
            <div className="flex justify-between my-1">
                {tabs.map((tab, i) => (
                    <div key={i}>
                        <TransparentButton
                            text={tab}
                            onClick={() => setCurrentTab(tab.toLowerCase() as Tab)}
                        />
                    </div>
                ))}
            </div>
            <div className="flex-grow overflow-auto">
                <ul>
                    {currentData.map(d => (
                        <li key={`${currentTab}-${d.id}`}>
                            {currentTab === "lectures" ? (
                                <TransparentLink
                                    to="/home/lectures/$lectureId"
                                    params={{
                                        lectureId: d.id
                                    }}
                                    text={d.name}
                                />
                            ) : currentTab === "assignments" ? (
                                <TransparentLink
                                    to="/home/assignments/$assignmentId"
                                    params={{
                                        assignmentId: d.id
                                    }}
                                    text={d.name}
                                />
                            ) : (
                                <TransparentLink
                                    to="/home/courses/$courseId/members/$memberId"
                                    params={{
                                        courseId: currentCourseId!,
                                        memberId: d.id
                                    }}
                                    text={d.name}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {userContext.role === "Teacher" && <div className="flex flex-row w-full justify-between px-2 pt-2">
                <div>
                    <TransparentButton
                        text="Add"
                        textSize="text-sm"
                        onClick={() => {
                            let destination;
                            if (currentTab == "lectures") {
                                destination = "/home/lectures/new"
                            }
                            else if (currentTab == "assignments") {
                                destination = "/home/assignments/new"
                            }
                            else if (currentTab == "members") {
                                destination = "??? will be implemented later"
                            }

                            router.navigate({
                                to: destination
                            });
                        }}
                    />
                </div>
                <div>
                    <TransparentButton
                        text="Delete"
                        textSize="text-sm"
                    />
                </div>
            </div>}
        </div>
    )
}

export default CourseBar