import { createFileRoute, Outlet } from '@tanstack/react-router'
import CourseBar from '../../components/CourseBar'
import Sidebar from '../../components/Sidebar'
import WebHeader from '../../components/WebHeader'

export const Route = createFileRoute('/home')({
    component: HomeLayout,
})

function HomeLayout() {
    return (
        <main>
            <div className="bg-main-page w-screen h-screen bg-center bg-cover fixed inset-0 z-0 overflow-hidden flex flex-col">

                <WebHeader />
                <div className="flex flex-row h-[calc(100vh-2rem)] w-full">
                    <div className='mb-4'>
                        <Sidebar />
                    </div>
                    <div className='mb-4'>
                        <CourseBar />
                    </div>
                    <div className="w-[calc(100vw-29rem)] rounded-2xl mx-2 mb-4 overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </main>
    )
}
