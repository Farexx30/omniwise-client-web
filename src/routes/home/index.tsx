import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/home/')({
    component: MainPage,
})

function MainPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
            <h1>Welcome to the main page!</h1>
            <div className="p-2 flex gap-2 z-10">
                <Link to="/login" className="[&.active]:font-bold text-white">
                    Login
                </Link>
                <Link to="/registration" className="[&.active]:font-bold text-white">
                    Register
                </Link>
            </div>
        </div>
    );
}