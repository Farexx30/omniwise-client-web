import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useContext, useState, type JSX } from 'react';
import LoadingView from '../../../../../components/LoadingView';
import Spinner from '../../../../../components/Spinner';
import TransparentButton from '../../../../../components/TransparentButton';
import { useDebounce } from '../../../../../hooks/useDebounce';
import { acceptMemberToCourse, getPendingMembersByCourseId, removeCourseMember } from '../../../../../services/api';
import { HomeContext } from '../../../route';
import UserAccept from '/user-accept.svg';
import UserDelete from '/user-delete.svg';

export const Route = createFileRoute('/home/courses/$courseId/members/pending')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const homeContext = useContext(HomeContext)!;

    const { data: pendingMembers, isLoading, error } = useQuery({
        queryKey: ["pendingMembers", homeContext.currentCourseId],
        queryFn: () => getPendingMembersByCourseId(homeContext.currentCourseId!),
        staleTime: 60_000 * 5
    })

    const queryClient = useQueryClient();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

    const { mutateAsync: removeMember } = useMutation({
        mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
            removeCourseMember(courseId, userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["pendingMembers", homeContext.currentCourseId] });
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

    const { mutateAsync: acceptMember } = useMutation({
        mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
            acceptMemberToCourse(courseId, userId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["pendingMembers", homeContext.currentCourseId] });
            await queryClient.invalidateQueries({ queryKey: ["members", homeContext.currentCourseId] });
            setIsSubmitting(false);
        },
        onError: (error) => {
            setIsSubmitting(false);
            alert(error instanceof Error
                ? error.message || "Unknown error"
                : new Error("An unexpected error occurred")
            );
        },
    });

    let content: JSX.Element | null = null;

    if (isLoading) {
        content = <Spinner />;
    }
    else if (error) {
        content = <p className="text-red-500 font-bold text-center text-xl mt-8">Error - {error.message}</p>;
    }
    else {
        content = (
            <>
                <h2 className='mb-4'>Applicants</h2>
                {pendingMembers && pendingMembers.length > 0 ? (
                    <ul>
                        {
                            pendingMembers.map(pm => (
                                <li key={pm.id}>
                                    <div className="flex flex-row w-full bg-white/10 rounded-lg p-4 shadow-md my-4">
                                        <span className='w-1/3 overflow-hidden text-ellipsis whitespace-nowrap' title={pm.name}><strong>{pm.name}</strong></span>
                                        <div className='w-1/3 justify-items-center overflow-hidden text-ellipsis whitespace-nowrap'>
                                            <span className='flex flex-row w-fit'>{pm.role}</span>
                                        </div>
                                        <div className='w-1/3 justify-items-end'>
                                            <div className='flex flex-row w-fit'>
                                                <TransparentButton
                                                    iconSrc={UserAccept}
                                                    onClick={async () => {
                                                        setIsSubmitting(true);
                                                        await acceptMember({
                                                            courseId: homeContext!.currentCourseId!.toString(),
                                                            userId: pm.id,
                                                        });
                                                    }}
                                                    disabled={isSubmitting}
                                                />
                                                <div className='ml-4'></div>
                                                <TransparentButton
                                                    iconSrc={UserDelete}
                                                    onClick={async () => {
                                                        setIsSubmitting(true);
                                                        await removeMember({
                                                            courseId: homeContext!.currentCourseId!.toString(),
                                                            userId: pm.id,
                                                        });
                                                    }}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                ) : (<p className="italic text-secondary-grey">There is no pending members.</p>)
                }
            </>
        )
    }

    return (
        isSubmittingDebounced && isSubmitting ? (
            <LoadingView />
        ) : (
            <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
                {content}
            </div>
        )
    )
}
