import { createFileRoute, Outlet } from '@tanstack/react-router'
import CourseBar from '../../components/CourseBar'
import Sidebar from '../../components/Sidebar'
import WebHeader from '../../components/WebHeader'
import { createContext, useEffect, useMemo, useState } from 'react'
import type { UserRole } from "../../types/user"
import { getObjFromJSONLocalStorage } from '../../utils/appHelpers'
import type { CourseInfo, UserInfo } from '../../types/localStorage'

export const Route = createFileRoute('/home')({
    component: HomeLayout,
})

export const UserContext = createContext<{
    role: UserRole | null;
    userId: string | null;
} | null>(null);

export const HomeContext = createContext<{
    currentCourseId: number | null;
    setCurrentCourseId: (value: number) => void;
    setCurrentCourseName: (value: string) => void;
} | null>(null);

function HomeLayout() {
    const { role: currentUserRole, userId: currentUserId } = getObjFromJSONLocalStorage("userInfo") as UserInfo;

    const [currentCourseId, setCurrentCourseId] = useState<number | null>(() => {
        const courseInfoObj = getObjFromJSONLocalStorage("courseInfo") as CourseInfo | null;
        return courseInfoObj?.id || null;
    });
    const [currentCourseName, setCurrentCourseName] = useState<string | null>(() => {
        const courseInfoObj = getObjFromJSONLocalStorage("courseInfo") as CourseInfo | null;
        return courseInfoObj?.name || null;
    });

    useEffect(() => {
        const courseInfoObj: CourseInfo = {
            id: currentCourseId,
            name: currentCourseName
        }

        localStorage.setItem("courseInfo", JSON.stringify(courseInfoObj))
    }, [currentCourseId, currentCourseName]);

    return (
        currentUserRole === "Admin" ? (
            <main>
                <div className="bg-main-page w-screen h-screen bg-center bg-cover fixed inset-0 z-0 overflow-hidden flex flex-col">
                    <WebHeader />
                    <div className="bg-black/20 flex-1 p-4 text-white flex flex-col  m-4 rounded-2xl">
                        <UserContext value={{ role: currentUserRole, userId: currentUserId }}>
                            <Outlet />
                        </UserContext>
                    </div>
                </div>
            </main>
        ) : (
            <main>
                <UserContext value={{ role: currentUserRole, userId: currentUserId }}>
                    <div className="bg-main-page w-screen h-screen bg-center bg-cover fixed inset-0 z-0 overflow-hidden flex flex-col">
                        <WebHeader />
                        <div className="flex flex-row h-[calc(100vh-2rem)] w-full">
                            <div className="mb-4">
                                <Sidebar onCourseClick={(courseId, courseName) => {
                                    setCurrentCourseId(courseId)
                                    setCurrentCourseName(courseName)
                                }}
                                />
                            </div>
                            <div className="mb-4">
                                <CourseBar
                                    currentCourseId={currentCourseId}
                                    setCurrentCourseId={setCurrentCourseId}
                                    currentCourseName={currentCourseName}
                                    setCurrentCourseName={setCurrentCourseName}
                                />
                            </div>
                            <div className="w-[calc(100vw-29rem)] rounded-2xl mx-2 mb-4 overflow-y-auto">
                                <HomeContext value={{ currentCourseId, setCurrentCourseId, setCurrentCourseName }}>
                                    <Outlet />
                                </HomeContext>
                            </div>
                        </div>
                    </div>
                </UserContext>
            </main>
        )
    )
}
