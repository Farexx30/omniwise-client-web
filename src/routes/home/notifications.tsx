import { createFileRoute } from "@tanstack/react-router"
import TransparentButton from "../../components/TransparentButton";
import { getNotifications } from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type JSX } from "react";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../utils/date";
import { deleteNotification } from "../../services/api";
import { useDebounce } from "../../hooks/useDebounce";
import LoadingView from "../../components/LoadingView";

export const Route = createFileRoute('/home/notifications')({
    component: Notifications,
})

function Notifications() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

    const { data: notifications, isLoading, error } = useQuery({
        queryFn: getNotifications,
        queryKey: ["notifications"]
    })

    const queryClient = useQueryClient();

    const { mutateAsync: removeNotification } = useMutation({
        mutationFn: deleteNotification,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["notifications"] });
            setIsSubmitting(false);
        },
        onError: (error) => {
            setIsSubmitting(false);
            alert(error instanceof Error
                ? error.message || "Unknown error"
                : new Error("An unexpected error occurred")
            );
        }
    });

    let content: JSX.Element | null = null;

    if (isLoading) {
        content = <Spinner />;
    }
    else if (error) {
        content = <p className="text-red-500 font-bold text-center text-xl mt-8">Error - {error.message}</p>;
    }
    else if (!notifications || notifications.length === 0) {
        content = <p className="text-white italic">No notifications found.</p>;
    }
    else {
        content = (
            <ul>
                {notifications && notifications.length > 0 ? (notifications.map(n => (
                    <li key={n.id} className="bg-white/10 rounded-lg p-4 shadow-md my-4">
                        <div className="flex flex-row w-full">
                            <div className="w-full">
                                <p className="text-base flex-1 break-words break-all hyphens-auto">{n.content}</p>
                                <p className="text-sm text-secondary-grey">{formatDate(n.sentDate)}</p>
                            </div>
                            <div className="ml-4">
                                <TransparentButton
                                    text="x"
                                    onClick={async () => {
                                        setIsSubmitting(true);
                                        await removeNotification(n.id);
                                    }}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </li>
                ))) : (
                    <p className="italic text-secondary-grey">No notifications yet.</p>
                )}
            </ul>
        )
    }

    return (
        isSubmittingDebounced && isSubmitting ? (
            <LoadingView />
        ) : (
            <div className="bg-black/20 h-full w-full p-4 text-white overflow-x-hidden">
                <h2 className="8 text-xl font-bold mb-4">Notifications</h2>
                {content}
            </div>
        )
    )
}

export default Notifications
