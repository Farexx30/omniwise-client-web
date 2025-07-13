import { createFileRoute, Link } from '@tanstack/react-router'
import { getCourseMemberById } from '../../../../../services/api'
import Spinner from '../../../../../components/Spinner'
import { useSuspenseQuery } from '@tanstack/react-query'
import TransparentButton from '../../../../../components/TransparentButton'
import TrashIcon from '/white-trash.svg'
import AssignmentSubmission from '../../../../../components/AssignmentSubmission'
import { formatDate } from '../../../../../utils/date'

export const Route = createFileRoute(
  '/home/courses/$courseId/members/$memberId',
)({
  component: CourseMember,
  pendingComponent: () => <Spinner />,
  errorComponent: () => <p className="text-red-500">Error.</p>,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["courseMember", Number(params.courseId), params.memberId],
      queryFn: () => getCourseMemberById(Number(params.courseId), params.memberId),
      staleTime: 60_000 * 5
    })

    return {
      courseId: Number(params.courseId),
      memberId: params.memberId
    }
  }
})

function CourseMember() {
  const { courseId, memberId } = Route.useLoaderData();

  const { data: courseMember } = useSuspenseQuery({
    queryKey: ["courseMember", courseId, memberId],
    queryFn: () => getCourseMemberById(courseId, memberId),
    staleTime: 60_000 * 5
  })

  return (
    <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
      <div className='flex flex-row justify-between items-center pb-2 border-b-1'>
        <div className='flex flex-row items-end'>
          <h2>{courseMember.fullName}</h2>
          <span className='ml-4 text-secondary-grey'>{courseMember.roleName}</span>
        </div>
        <div>
          <TransparentButton text=""
            iconSrc={TrashIcon}
            onClick={() => { }}
          />
        </div>
      </div>
      <div className='flex flex-row pb-2  border-b-1 mt-2 mb-4'>
        <span><strong>E-mail: </strong>{courseMember.email}</span>
        <span className='ml-8'><strong>Enrolled on: </strong>{courseMember.joinDate}</span>
      </div>
      <h3>Grades</h3>
      {courseMember.assignmentSubmissions && courseMember.assignmentSubmissions.length > 0 ? (
        <ul>
          {courseMember.assignmentSubmissions.map(as => (
            <li key={as.id}>
              <Link
                to="/home/assignment-submissions/$assignmentSubmissionId"
                params={{ assignmentSubmissionId: as.id.toString() }
                }>
                <div className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                  <span><strong>{as.name}</strong></span>                  
                  <span><strong>Grade: </strong>{as.grade}</span>
                  <span><strong>Submission date: </strong>{formatDate(as.latestSubmissionDate)}</span>
                  <span><strong>Deadline: </strong>{formatDate(as.deadline)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-secondary-grey">No submissions yet.</p>
      )}
    </div>
  )
}
