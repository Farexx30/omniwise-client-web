import { createFileRoute, Outlet } from '@tanstack/react-router'
import CourseBar from '../../components/CourseBar'
import Sidebar from '../../components/Sidebar'
import WebHeader from '../../components/WebHeader'
import { createContext, useEffect, useState } from 'react'
import type { UserRole } from "../../types/user"

export const Route = createFileRoute('/home')({
    component: HomeLayout,
})

export const UserContext = createContext<{
    role: UserRole | null;
} | null>(null);

export const HomeContext = createContext<{
    currentCourseId: number | null;
    setCurrentCourseId: (value: number) => void;
    setCurrentCourseName: (value: string) => void;
} | null>(null);

function HomeLayout() {
    const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
    const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
    const [currentCourseName, setCurrentCourseName] = useState<string | null>(null);

    useEffect(() => {
        setCurrentUserRole(localStorage.getItem("role") as UserRole);

        const courseId = localStorage.getItem("currentCourseId");
        if (courseId !== null) {
            setCurrentCourseId(Number(courseId));
        }

        const courseName = localStorage.getItem("currentCourseName");
        if (courseName !== null) {
            setCurrentCourseName(courseName);
        }
    }, []);

    useEffect(() => {
        if (currentCourseId === null || currentCourseName === null) {
            return;
        }

        localStorage.setItem("currentCourseId", currentCourseId.toString());
        localStorage.setItem("currentCourseName", currentCourseName);
    }, [currentCourseId, currentCourseName]);

    return (
        <main>
            <UserContext value={{ role: currentUserRole }}>
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
                                currentCourseName={currentCourseName}
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
}
