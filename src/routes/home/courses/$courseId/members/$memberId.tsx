import { createFileRoute } from '@tanstack/react-router'
import { getCourseMemberById } from '../../../../../services/api'
import Spinner from '../../../../../components/Spinner'
import { useSuspenseQuery } from '@tanstack/react-query'

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
    <div className="text-white">
      Welcome to the member with id: {courseMember.id} in course with id: {courseId},
      <br />
      joinDate: {courseMember.joinDate},
      <br />
      fullName: {courseMember.fullName},
      <br />
      email: {courseMember.email}
      <br />
      roleName: {courseMember.roleName} 
    </div>
  )
}
