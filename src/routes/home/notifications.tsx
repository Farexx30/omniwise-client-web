import { createFileRoute } from "@tanstack/react-router"
import TransparentButton from "../../components/TransparentButton";

export const Route = createFileRoute('/home/notifications')({
    component: Notifications,
})

interface Notification {
    content: string;
    date: string;
}

const mockNotifications: Notification[] = [
    {
        content: "Nowa wiadomość od zespołu.",
        date: "2025-07-07 10:15",
    },
    {
        content: "Twoje hasło zostało pomyślnie zmienione.",
        date: "2025-07-06 14:22",
    },
    {
        content: "Zarejestrowano nowe logowanie na Twoje konto.",
        date: "2025-07-05 08:37",
    },
];

function Notifications() {
    return (
        <div className="bg-black/20 h-full w-full p-4 text-white">
            <h2 className="8 text-xl font-bold mb-4">Notifications</h2>
            <ul className="space-y-3">
                {mockNotifications.map((notification, index) => (
                    <li
                        key={index}
                        className="bg-white/10 rounded-lg p-4 shadow-md"
                    >
                        <div className="flex flex-row w-full">
                            <div className="w-full">
                                <p className="text-base">{notification.content}</p>
                                <p className="text-sm text-secondary-grey">{notification.date}</p>
                            </div>
                            <div className="ml-4">
                            <TransparentButton
                                text="x"
                            />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Notifications
