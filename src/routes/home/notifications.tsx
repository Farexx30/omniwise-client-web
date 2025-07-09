import { createFileRoute } from "@tanstack/react-router"
import TransparentButton from "../../components/TransparentButton";
import { getNotifications } from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { JSX } from "react";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../utils/date";
import { deleteNotification } from "../../services/api";

export const Route = createFileRoute('/home/notifications')({
    component: Notifications,
})

function Notifications() {
    const { data: notifications, isLoading, isError } = useQuery({
        queryFn: getNotifications,
        queryKey: ["notifications"]
    })

    const queryClient = useQueryClient();

    const { mutate: removeNotification } = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] }); // odśwież listę
        },
    });
    
    let content: JSX.Element | null = null;

    if (isLoading) {
        content = <Spinner />;
    }
    else if (isError) {
        content = <p className="text-red-500">Error.</p>;
    }
    else if (!notifications || notifications.length === 0) {
        content = <p>No notifications found.</p>;
    }
    else {
        content = (
            <ul>
                {notifications.map(n => (
                    <li key={n.id} className="bg-white/10 rounded-lg p-4 shadow-md my-4">
                        <div className="flex flex-row w-full">
                            <div className="w-full">
                                <p className="text-base">{n.content}</p>
                                <p className="text-sm text-secondary-grey">{formatDate(n.sentDate)}</p>
                            </div>
                            <div className="ml-4">
                                <TransparentButton
                                    text="x"
                                        onClick={() => {removeNotification(n.id);
    }}
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="bg-black/20 h-full w-full p-4 text-white">
            <h2 className="8 text-xl font-bold mb-4">Notifications</h2>
            {content}
        </div>
    )
}

export default Notifications
