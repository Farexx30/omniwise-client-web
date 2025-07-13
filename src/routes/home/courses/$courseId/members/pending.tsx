import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useContext } from 'react';
import { acceptMemberToCourse, getPendingMembersByCourseId, removeCourseMember } from '../../../../../services/api';
import UserDelete from '/user-delete.svg'
import UserAccept from '/user-accept.svg'
import { HomeContext } from '../../../route';
import TransparentButton from '../../../../../components/TransparentButton';

export const Route = createFileRoute('/home/courses/$courseId/members/pending')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const homeContext = useContext(HomeContext)!;

    const { data: pendingMembers } = useQuery({
        queryKey: ["pendingMembers", homeContext.currentCourseId],
        queryFn: () => getPendingMembersByCourseId(homeContext.currentCourseId!),
        staleTime: 60_000 * 5
    })

    const queryClient = useQueryClient();

    const { mutate: removeMember } = useMutation({
        mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
            removeCourseMember(courseId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingMembers", homeContext.currentCourseId] });
        },
        onError: () => {
            alert("An error occured while deleting course member.")
        }
    });

    const { mutateAsync: acceptMember } = useMutation({
        mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
            acceptMemberToCourse(courseId, userId),
        onSuccess: async () => {
          queryClient.invalidateQueries({ queryKey: ["pendingMembers", homeContext.currentCourseId] });
        },
        onError: () => {
          alert("An error occured while accepting member.")
        },
      });

    return <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
        <h2 className='mb-4'>Applicants</h2>
        {pendingMembers && pendingMembers.length > 0 ? (
            <ul>
                {
                    pendingMembers.map(pm => (
                        <li key={pm.id}>
                            <div className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                                <span><strong>{pm.name}</strong></span>
                                <div className='flex flex-row'>
                                    <TransparentButton
                                        iconSrc={UserAccept}
                                        onClick={() =>
                                            acceptMember({
                                                courseId: homeContext!.currentCourseId!.toString(),
                                                userId: pm.id,
                                            })}
                                    />
                                    <div className='ml-4'>
                                    </div>

                                    <TransparentButton
                                        iconSrc={UserDelete}
                                        onClick={() =>
                                            removeMember({
                                                courseId: homeContext!.currentCourseId!.toString(),
                                                userId: pm.id,
                                            })}
                                    />
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        ) : (<p className="italic text-secondary-grey">There is no pending members.</p>)}

    </div>
}
