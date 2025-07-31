import { createFileRoute, Outlet } from '@tanstack/react-router'
import CourseBar from '../../components/CourseBar'
import Sidebar from '../../components/Sidebar'
import WebHeader from '../../components/WebHeader'
import { createContext, useEffect, useMemo, useState } from 'react'
import type { UserRole } from "../../types/user"
import { getObjFromJSONLocalStorage } from '../../utils/appHelpers'
import type { LocalStorageCourseInfo, UserInfo } from '../../types/localStorage'

export const Route = createFileRoute('/home')({
    component: HomeLayout,
})

export const UserContext = createContext<{
    role: UserRole | null;
    userId: string | null;
} | null>(null);

export const HomeContext = createContext<{
    currentCourseId: number | null;
    currentCourseOwnerId: string | null;
    setCurrentCourseId: (value: number | null) => void;
    setCurrentCourseOwnerId: (value: string | null) => void;
} | null>(null);

function HomeLayout() {
    const { role: currentUserRole, userId: currentUserId } = getObjFromJSONLocalStorage("userInfo") as UserInfo;

    const [currentCourseId, setCurrentCourseId] = useState<number | null>(() => {
        const courseInfoObj = getObjFromJSONLocalStorage("courseInfo") as LocalStorageCourseInfo | null;
        return courseInfoObj?.id || null;
    });
    const [currentCourseOwnerId, setCurrentCourseOwnerId] = useState<string | null > (() => {
        const courseInfoObj = getObjFromJSONLocalStorage("courseInfo") as LocalStorageCourseInfo | null;
        return courseInfoObj?.ownerId || null;
    })

    useEffect(() => {
        const courseInfoObj: LocalStorageCourseInfo = {
            id: currentCourseId,
            ownerId: currentCourseOwnerId
        }

        localStorage.setItem("courseInfo", JSON.stringify(courseInfoObj))
    }, [currentCourseId]);

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
                                <Sidebar onCourseClick={(courseId, courseOwnerId) => {
                                    setCurrentCourseId(courseId);
                                    setCurrentCourseOwnerId(courseOwnerId);
                                }}
                                />
                            </div>
                            <div className="mb-4">
                                <CourseBar
                                    currentCourseId={currentCourseId}
                                    setCurrentCourseId={setCurrentCourseId}
                                    currentCourseOwnerId={currentCourseOwnerId}
                                    setCurrentCourseOwnerId={setCurrentCourseOwnerId}
                                />
                            </div>
                            <div className="w-[calc(100vw-29rem)] rounded-2xl mx-2 mb-4 overflow-y-auto">
                                <HomeContext value={{ currentCourseId, currentCourseOwnerId, setCurrentCourseId, setCurrentCourseOwnerId }}>
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
