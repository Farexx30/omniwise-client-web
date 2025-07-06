import { createFileRoute, Link } from '@tanstack/react-router'
import WebHeader from '../../components/WebHeader'
import Sidebar from '../../components/Sidebar'
import CourseBar from '../../components/CourseBar'
import MainContainer from '../../components/MainContainer'

export const Route = createFileRoute('/home/')({
    component: MainPage,
})

function MainPage() {
    return (
        <main>
            <div className="bg-main-page w-screen h-screen bg-center bg-cover fixed inset-0 z-0 overflow-hidden flex flex-col">

                <WebHeader />
                <div className="flex flex-row h-[calc(100vh-2rem)] w-full">
                    <Sidebar />
                    <CourseBar />
                    <MainContainer/>
                </div>
            </div>
        </main>
    )
}