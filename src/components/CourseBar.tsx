import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../routes/home/route";
import { deleteCourse, getAssignmentsByCourseId, getCourseById, getLecturesByCourseId, getMembersByCourseId } from "../services/api";
import type { BasicAssignmentInfo } from "../types/assignment";
import type { BasicLectureInfo } from "../types/lecture";
import type { BasicUserInfo } from "../types/user";
import TransparentButton from "./TransparentButton";
import TransparentLink from "./TransparentLink";

interface CourseBarProps {
    currentCourseId: number | null;
    setCurrentCourseId: (value: number | null) => void;
    currentCourseOwnerId: string | null;
}

type Tab = "lectures" | "assignments" | "members";

const mapToAddButton: Record<Tab, string> = {
    "lectures": "Lecture",
    "assignments": "Assignment",
    "members": "Members"
}

const CourseBar = ({ currentCourseId, setCurrentCourseId, currentCourseOwnerId }: CourseBarProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const userContext = useContext(UserContext)!;

    const [currentTab, setCurrentTab] = useState<Tab>("lectures")
    const [currentData, setCurrentData] = useState<
        BasicLectureInfo[]
        | BasicAssignmentInfo[]
        | BasicUserInfo[]
    >([])

    const [isDeletingCourse, setIsDeletingCourse] = useState(false);

    const { data: currentCourse } = useQuery({
        queryKey: ["course", currentCourseId],
        queryFn: () => getCourseById(currentCourseId!),
        enabled: currentCourseId !== null,
        staleTime: 60_000 * 5
    })

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

    const { mutateAsync: removeCourse } = useMutation({
        mutationFn: () => deleteCourse(currentCourseId!),
        onSuccess: async () => {
            setCurrentCourseId(null);
            setIsDeletingCourse(false);
            await queryClient.invalidateQueries({ queryKey: ["courses"] });
            router.navigate({ to: "/home" });
        },
        onError: (error) => {
            setIsDeletingCourse(false);
            alert(error instanceof Error
                ? error.message || "Unknown error"
                : new Error("An unexpected error occurred")
            );
        }
    });

    useEffect(() => {
        if (currentTab == "lectures") setCurrentData(lectures || []);
        else if (currentTab == "assignments") setCurrentData(assignments || []);
        else if (currentTab == "members") setCurrentData(members || []);
    }, [currentTab, lectures, assignments, members])

    const tabs = ["Lectures", "Assignments", "Members"];

    return (
        <div className="flex flex-col bg-black/20 rounded-2xl h-full w-72 op-0 bottom-0 left-0 overflow-y-auto">
            <div className="flex flex-col p-5 flex-grow overflow-y-auto">
                <span
                    className="font-bold text-xl text-secondary-grey select-none overflow-hidden whitespace-nowrap text-ellipsis pb-2 border-b border-secondary-grey border-2/20"
                    title={currentCourseId ? (currentCourse?.name || "Loading...") : "No course selected"}
                >
                    {currentCourseId ? (currentCourse?.name || <span className="italic text-secondary-grey">Loading...</span>) : <span className="italic text-secondary-grey">No course selected</span>}
                </span>
                {currentCourseId && (
                    <>
                        <div className="flex justify-between my-1">
                            {tabs.map((tab, i) => (
                                <div key={i}>
                                    <TransparentButton
                                        text={tab}
                                        onClick={() => setCurrentTab(tab.toLowerCase() as Tab)}
                                        withEffect={tab.toLowerCase() === currentTab}
                                        disabled={isDeletingCourse}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex-grow overflow-auto">
                            <ul>
                                {(currentData && currentData.length > 0) ? (currentData.map(d => (
                                    <li key={`${currentTab}-${d.id}`}>
                                        {currentTab === "lectures" ? (
                                            <TransparentLink
                                                to="/home/lectures/$lectureId"
                                                params={{
                                                    lectureId: d.id
                                                }}
                                                text={d.name}
                                                disabled={isDeletingCourse}
                                            />
                                        ) : currentTab === "assignments" ? (
                                            <TransparentLink
                                                to="/home/assignments/$assignmentId"
                                                params={{
                                                    assignmentId: d.id
                                                }}
                                                text={d.name}
                                                disabled={isDeletingCourse}
                                            />
                                        ) : (
                                            <TransparentLink
                                                to="/home/courses/$courseId/members/$memberId"
                                                params={{
                                                    courseId: currentCourseId!,
                                                    memberId: d.id
                                                }}
                                                text={d.name}
                                                disabled={isDeletingCourse}
                                            />
                                        )}
                                    </li>
                                ))) : (
                                    <p className="italic text-secondary-grey">No {currentTab.toString()} yet.</p>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </div>
            {(currentCourseId && userContext.role === "Teacher") && (
                <div className="flex flex-row w-full justify-between px-2 pt-2 pb-2">
                    <div className="ml-1">
                        <TransparentButton
                            text={`Add ${mapToAddButton[currentTab]}`}
                            textSize="text-l"
                            onClick={() => {
                                if (currentTab == "lectures") {
                                    router.navigate({ to: "/home/lectures/new" });
                                }
                                else if (currentTab == "assignments") {
                                    router.navigate({ to: "/home/assignments/new" });
                                }
                                else if (currentTab == "members") {
                                    router.navigate({
                                        to: "/home/courses/$courseId/members/pending",
                                        params: { courseId: currentCourseId!.toString() }
                                    });
                                }
                            }}
                            disabled={isDeletingCourse}
                        />
                    </div>
                    {userContext.userId === currentCourseOwnerId &&
                        <div className="mr-1">
                            <TransparentButton
                                text="Delete course"
                                textSize="text-l"
                                onClick={async () => {
                                    setIsDeletingCourse(true);
                                    await removeCourse()
                                }}
                                disabled={isDeletingCourse}
                            />
                        </div>
                    }
                </div>
            )}

        </div>
    )
}

export default CourseBar