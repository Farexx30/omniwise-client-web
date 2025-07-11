import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createAssignmentSubmission, getAssignmentById } from '../../../../services/api'
import { useContext, type FormEvent } from 'react'
import { HomeContext, UserContext } from '../../route'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import TransparentButton from '../../../../components/TransparentButton'
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import { useFile } from '../../../../hooks/useFile'
import { formatDate } from '../../../../utils/date'
import FileInput from '../../../../components/FileInput'

export const Route = createFileRoute('/home/assignments/$assignmentId/new-submission')({
    component: NewAssignmentSubmission,
    loader: async ({ params, context: { queryClient } }) => {
        await queryClient.prefetchQuery({
            queryKey: ["assignment", Number(params.assignmentId)],
            queryFn: () => getAssignmentById(Number(params.assignmentId)),
            staleTime: 60_000 * 5
        })

        return {
            assignmentId: Number(params.assignmentId)
        }
    }
})


function NewAssignmentSubmission() {
    const { assignmentId } = Route.useLoaderData();
    const router = useRouter();
    const queryClient = useQueryClient();
    const userContext = useContext(UserContext)!;
    const homeContext = useContext(HomeContext);

    const { data: assignment } = useSuspenseQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => getAssignmentById(assignmentId),
        staleTime: 60_000 * 5
    })

    const { files, onChange, removeFile, clearFiles } = useFile({ multiple: true });

    const { mutateAsync: addAssignmentSubmission } = useMutation({
        mutationFn: (formData: FormData) => createAssignmentSubmission(formData, assignmentId),
        onSuccess: async(assignmentSubmissionId) => {
            await queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] })
            router.navigate({
                to: "/home/assignment-submissions/$assignmentSubmissionId",
                params: {
                    assignmentSubmissionId: assignmentSubmissionId.toString()
                }
            })
        },
        onError: () => {
            alert("An error occured while creating an assignment submission.")
        }
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        files.forEach((f) => {
            formData.append("files", f);
        })

        await addAssignmentSubmission(formData);
    }

    return (
        <form
            className="bg-black/20 h-full w-full p-4 text-white flex flex-col"
            onSubmit={handleSubmit}
        >
            <div className='flex flex-row justify-between pb-2 border-b-1'>
                <h2>{assignment.name}</h2>
                <div className='flex flex-row'>
                    <TransparentButton
                        text=""
                        iconSrc={AcceptIcon}
                        isSubmitType={true}
                        disabled={files.length < 1}
                    />
                    <div className='w-2'></div>
                    <TransparentButton
                        text=""
                        iconSrc={DiscardIcon}
                        onClick={() => router.navigate({
                            to: "/home/assignments/$assignmentId",
                            params: {
                                assignmentId: assignmentId.toString()
                            }
                        })}
                    />
                </div>
            </div>
            <div className='flex flex-row pb-2 border-b-1 mt-2 justify-between'>
                <span><strong>Author: </strong>---</span>
                <span><strong>Submission date: </strong>---</span>
                <span><strong>Deadline date:</strong> {formatDate(assignment.deadline)}</span>
            </div>
            <div className="flex flex-row justify-between mt-4">
                <h3>Files</h3>
            </div>
            <FileInput
                data={files}
                onChange={onChange}
                onRemove={removeFile}
                onClear={clearFiles}
                multiple={true}
            />
        </form>
    )
}

