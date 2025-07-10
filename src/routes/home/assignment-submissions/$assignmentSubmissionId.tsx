import { createFileRoute } from '@tanstack/react-router'
import TransparentButton from '../../../components/TransparentButton';
import { formatDate } from '../../../utils/date';
import EditIcon from '/edit.svg'
import { useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import { createAssignmentSubmissionComment, getAssignmentSubmissionById } from '../../../services/api';
import { useState } from 'react';


export const Route = createFileRoute('/home/assignment-submissions/$assignmentSubmissionId',)
  ({
    component: AssignmentSubmission,
    pendingComponent: () => <Spinner />,
    errorComponent: () => <p className="text-red-500">Error.</p>,
    loader: async ({ params, context: { queryClient } }) => {
      await queryClient.prefetchQuery({
        queryKey: ["assignmentSubmission", Number(params.assignmentSubmissionId)],
        queryFn: () => getAssignmentSubmissionById(Number(params.assignmentSubmissionId)),
        staleTime: 60_000 * 5
      })

      return {
        assignmentSubmissionId: Number(params.assignmentSubmissionId)
      }
    }
  })

function AssignmentSubmission() {
  const [newComment, setNewComment] = useState("");
  const { assignmentSubmissionId } = Route.useLoaderData();

  const { data: assignmentSubmission } = useSuspenseQuery({
    queryKey: ["assignmentSubmission", assignmentSubmissionId],
    queryFn: () => getAssignmentSubmissionById(assignmentSubmissionId),
    staleTime: 60_000 * 5
  })


  const queryClient = useQueryClient();


  const { mutateAsync: addComment, isPending } = useMutation({
    mutationFn: (content: string) =>
      createAssignmentSubmissionComment(assignmentSubmissionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignmentSubmission", assignmentSubmissionId] });
    },
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert("Failed to add comment");
    }
  };

  return (
    <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
      <div className='flex flex-row justify-between pb-2 border-b-1'>
        <h2>assignmentname</h2>
      </div>
      <div className='flex flex-row pb-2 border-b-1 mt-2'>
        <span><strong>Submission date:</strong> {formatDate(assignmentSubmission.latestSubmissionDate)}</span>
        <span className='ml-8'><strong>Deadline date:</strong> </span>
      </div>
      <div className='w-full h-44 bg-pink-50 mt-4'>
        files
      </div>
      <div className='mt-4 overflow-y-auto flex-1 overflow-x-hidden w-full pr-2'>
        <h3>Grade:</h3>
        <div className='flex flex-row'>
          <span className='text-xl mr-4'>{assignmentSubmission.grade != null ? assignmentSubmission.grade : "-"}/max</span>
          <TransparentButton text=""
            iconSrc={EditIcon} />
        </div>
        <h3 className='mt-4'>Comments:</h3>
        {assignmentSubmission.comments && assignmentSubmission.comments.length > 0 ? (
          <ul>
            {assignmentSubmission.comments.map(c => (
              <li key={c.id} className="flex flex-col bg-white/10 rounded-lg p-4 shadow-md my-4">
                <div className="flex flex-row justify-between">
                  <p><strong> {c.authorFullName}</strong></p>
                  <p>{formatDate(c.sentDate)}</p>
                </div>
                <p className="break-words whitespace-pre-wrap w-full max-w-full">
                  {c.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-secondary-grey">No comments yet.</p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 items-center flex flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            placeholder="Add a comment..."
            className="w-full bg-white/10 text-white p-2 rounded-lg resize-none border-none focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={newComment.trim() === "" || isPending}
            className="mt-2 ml-4 mr-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-full disabled:opacity-50 hover:drop-shadow-[0_0_8px_rgba(140,71,246,1)] transition mb-3 disabled:bg-gray-500 disabled:cursor-default disabled:hover:drop-shadow-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
