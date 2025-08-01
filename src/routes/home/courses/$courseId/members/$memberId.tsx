import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import ErrorComponentView from '../../../../../components/ErrorComponentView'
import LoadingView from '../../../../../components/LoadingView'
import Spinner from '../../../../../components/Spinner'
import TransparentButton from '../../../../../components/TransparentButton'
import { useDebounce } from '../../../../../hooks/useDebounce'
import { getCourseMemberById, removeCourseMember } from '../../../../../services/api'
import { formatDate } from '../../../../../utils/date'
import { HomeContext, UserContext } from '../../../route'
import UserDelete from '/user-delete.svg'

export const Route = createFileRoute(
  '/home/courses/$courseId/members/$memberId',
)({
  component: CourseMember,
  pendingComponent: () => <Spinner />,
  errorComponent: ({ error }) => <ErrorComponentView message={error.message} />,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

  const { mutateAsync: removeMember } = useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) => removeCourseMember(courseId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members", homeContext.currentCourseId] })

      navigate({
        to: "/home/courses/$courseId",
        params: {
          courseId: homeContext!.currentCourseId!.toString()
        }
      });
    },
    onError: (error) => {
      setIsSubmitting(false);
      alert(error instanceof Error
        ? error.message || "Unknown error"
        : new Error("An unexpected error occurred")
      );
    }
  });

  return (
    isSubmittingDebounced && isSubmitting ? (
      <LoadingView />
    ) : (
      <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
        <div className='flex flex-row justify-between items-center pb-2 border-b-1'>
          <div className="flex items-center min-w-0">
            <h2
              className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis"
              title={courseMember.fullName}>
              {courseMember.fullName}
            </h2>
            <span className="ml-4 text-secondary-grey shrink-0">
              {courseMember.roleName}
              {memberId === homeContext.currentCourseOwnerId && " (Owner)"}
              {memberId == userContext.userId && " (You)"}
            </span>
          </div>

          {(userContext.role === "Teacher"
            && (courseMember.roleName !== "Teacher" || userContext.userId === homeContext.currentCourseOwnerId)
            && memberId !== homeContext.currentCourseOwnerId) && (
              <div className="ml-4">
                <TransparentButton
                  text=""
                  iconSrc={UserDelete}
                  onClick={async () => {
                    setIsSubmitting(true);
                    await removeMember({
                      courseId: homeContext!.currentCourseId!.toString(),
                      userId: courseMember.id,
                    })
                  }}
                  disabled={isSubmitting}
                />
              </div>
            )}
        </div>
        <div className='flex flex-row pb-2  border-b-1 mt-2 mb-4'>
          <span className="max-w-[75%] overflow-hidden text-ellipsis whitespace-nowrap"><strong>E-mail: </strong>{courseMember.email}</span>
          <span className="ml-8"><strong>Enrolled on: </strong>{courseMember.joinDate}</span>
        </div>
        <h3>Submissions</h3>
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
                    <div className="flex w-full flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                      <span className='w-1/3 overflow-hidden text-ellipsis whitespace-nowrap' title={as.name}><strong>{as.name}</strong></span>
                      <span className='w-1/6 overflow-hidden text-ellipsis whitespace-nowrap'><strong>Grade: </strong>{as.grade !== null ? as.grade : "-"}</span>
                      <span className='w-1/4 overflow-hidden text-ellipsis whitespace-nowrap'><strong>Submitted: </strong>{formatDate(as.latestSubmissionDate)}</span>
                      <span className='w-1/4 overflow-hidden text-ellipsis whitespace-nowrap text-right'><strong>Deadline: </strong>{formatDate(as.deadline)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            courseMember.id !== userContext.userId && userContext.role === "Student" ?
              (
                <p className="italic text-secondary-grey">You cannot view other member submissions.</p>
              ) :
              (
                <p className="italic text-secondary-grey">No submissions yet.</p>
              )
          )
        }
      </div>
    )
  )
}
