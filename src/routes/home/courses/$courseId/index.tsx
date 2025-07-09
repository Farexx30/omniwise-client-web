import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import Spinner from '../../../../components/Spinner';
import { getCourseById } from '../../../../services/api';


export const Route = createFileRoute('/home/courses/$courseId/')({
  component: Course,
  pendingComponent: () => <Spinner />,
  errorComponent: () => <p className="text-red-500">Error.</p>,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["course", Number(params.courseId)],
      queryFn: () => getCourseById(Number(params.courseId)),
      staleTime: 60_000 * 5
    })

    return {
      courseId: Number(params.courseId)
    }
  }
})

function Course() {
  const { courseId } = Route.useLoaderData();

  const { data: course } = useSuspenseQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    staleTime: 60_000 * 5
  })

  return (
    <div className="flex text-center items-center justify-center text-5xl text-white">
      Welcome to {course.name} 😊
    </div>
  )
}
