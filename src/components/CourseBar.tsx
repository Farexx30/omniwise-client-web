import { useQuery } from "@tanstack/react-query";
import type { BasicLectureInfo } from "../types/lecture";
import TransparentButton from "./TransparentButton"
import TransparentLink from "./TransparentLink";
import { getLecturesByCourseId } from "../services/api";
import { useEffect, useState } from "react";

interface CourseBarProps {
    currentCourseId: number | null;
    currentCourseName: string | null
}

const CourseBar = ({ currentCourseId, currentCourseName }: CourseBarProps) => {
    const [currentData, setCurrentData] = useState<BasicLectureInfo[]>([])

    const { data: lectures } = useQuery({
        queryKey: ["lectures", currentCourseId],
        queryFn: () => getLecturesByCourseId(currentCourseId!),
        enabled: currentCourseId !== null,
        staleTime: 60_000 * 5
    })

    useEffect(() => {
        setCurrentData(lectures || [])
    }, [lectures])

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
                        />
                    </div>
                ))}
            </div>
            <div className="flex-grow overflow-auto">
                <ul>
                    {currentData.map(d => (
                        <li key={d.id}>
                            <TransparentLink
                                to="/home"
                                text={d.name}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-row w-full justify-between px-2 pt-2">
                <div>
                    <TransparentButton
                        text="Add"
                        textSize="text-sm"
                    />
                </div>
                <div>
                    <TransparentButton
                        text="Delete"
                        textSize="text-sm"
                    />
                </div>
            </div>
        </div>
    )
}

export default CourseBar