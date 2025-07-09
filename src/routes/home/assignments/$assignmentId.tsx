import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Spinner from '../../../components/Spinner'
import { deleteAssignment, getAssignmentById } from '../../../services/api'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import TransparentButton from '../../../components/TransparentButton'
import TrashIcon from '/white-trash.svg'
import EditIcon from '/edit.svg'
import { formatDate } from '../../../utils/date'

export const Route = createFileRoute('/home/assignments/$assignmentId')({
  component: Assignment,
  pendingComponent: () => <Spinner />,
  errorComponent: () => <p className="text-red-500">Error.</p>,
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

function Assignment() {
  const { assignmentId } = Route.useLoaderData();

  const { data: assignment } = useSuspenseQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
    staleTime: 60_000 * 5
  })

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: removeAssignment } = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      navigate({ to: "/home" });
    },
  });

  return (
    <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
      <div className='flex flex-row justify-between pb-2 border-b-1'>
        <h2>{assignment.name}</h2>
        <div className='flex flex-row'>
          <TransparentButton text=""
            iconSrc={EditIcon} />
          <div className='w-2'></div>
          <TransparentButton text=""
            iconSrc={TrashIcon}
            onClick={() => {
              removeAssignment(assignment.id);
            }} />
        </div>
      </div>
      <div className='flex flex-row pb-2 border-b-1 mt-2'>
        <span>{formatDate(assignment.deadline)}</span>
        <span className='ml-8'>Maximum grade: {assignment.maxGrade}</span>
      </div>
      <div className='w-full h-44 bg-pink-50 mt-4'>
        files
      </div>
      <div className='mt-4 overflow-y-auto flex-1'>
        {assignment.content}
        <h3 className='mt-4'>Submissions:</h3>
        {assignment.submissions && assignment.submissions.length > 0 ? (
          <ul>
            {assignment.submissions.map(s => (
              <li key={s.id} className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                <p><strong> {s.authorFullName}</strong></p>
                <div className="flex flex-row ">
                  <p><strong>Grade:</strong> {s.grade != null ? s.grade : "-"}/{assignment.maxGrade}</p>

                  <p className='ml-8'><strong>Date:</strong> {formatDate(s.latestSubmissionDate)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-secondary-grey">No submissions yet.</p>
        )}
      </div>
    </div>
  )
}
