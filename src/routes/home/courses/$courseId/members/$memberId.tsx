import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { getCourseMemberById, removeCourseMember } from '../../../../../services/api'
import Spinner from '../../../../../components/Spinner'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import TransparentButton from '../../../../../components/TransparentButton'
import UserDelete from '/user-delete.svg'
import { formatDate } from '../../../../../utils/date'
import { HomeContext, UserContext } from '../../../route'
import { useContext } from 'react'

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
  const userContext = useContext(UserContext)!;
  const homeContext = useContext(HomeContext)!;
  const { courseId, memberId } = Route.useLoaderData();

  const { data: courseMember } = useSuspenseQuery({
    queryKey: ["courseMember", courseId, memberId],
    queryFn: () => getCourseMemberById(courseId, memberId),
    staleTime: 60_000 * 5
  })

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: removeMember } = useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      removeCourseMember(courseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseMembers"] });

      navigate({
        to: "/home/courses/$courseId",
        params: {
          courseId: homeContext!.currentCourseId!.toString()
        }
      });
    },
    onError: () => {
      alert("An error occured while deleting course member.")
    }
  });

  return (
    <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
      <div className='flex flex-row justify-between items-center pb-2 border-b-1'>
        <div className='flex flex-row items-end'>
          <h2>{courseMember.fullName}</h2>
          <span className='ml-4 text-secondary-grey'>{courseMember.roleName}</span>
        </div>
        <div>
          <TransparentButton text=""
            iconSrc={UserDelete}
            onClick={() =>
              removeMember({
                courseId: homeContext!.currentCourseId!.toString(),
                userId: courseMember.id,
              })}
          />
        </div>
      </div>
      <div className='flex flex-row pb-2  border-b-1 mt-2 mb-4'>
        <span><strong>E-mail: </strong>{courseMember.email}</span>
        <span className='ml-8'><strong>Enrolled on: </strong>{courseMember.joinDate}</span>
      </div>
      <h3>Grades</h3>
      {courseMember.assignmentSubmissions
        && courseMember.assignmentSubmissions.length > 0
        && (courseMember.id === userContext.userId || userContext.role === "Teacher")
        ? (
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
          courseMember.id !== userContext.userId && userContext.role === "Student" ?
            (
              <p className="italic text-secondary-grey">You cannot view other member grades.</p>
            ) :
            (
              <p className="italic text-secondary-grey">No submissions yet.</p>
            )

        )
      }
    </div >
  )
}
