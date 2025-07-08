import { createFileRoute } from '@tanstack/react-router'
import { getLectureById } from '../../../services/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import Spinner from '../../../components/Spinner'

export const Route = createFileRoute('/home/lectures/$lectureId')({
  component: Lecture,
  pendingComponent: () => <Spinner />,
  errorComponent: () => <p className="text-red-500">Error.</p>,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["lecture", Number(params.lectureId)],
      queryFn: () => getLectureById(Number(params.lectureId)),
      staleTime: 60_000 * 5
    })

    return {
      lectureId: Number(params.lectureId)
    }
  }
})

function Lecture() {
  const { lectureId } = Route.useLoaderData();

  const { data: lecture } = useSuspenseQuery({
    queryKey: ["lecture", lectureId],
    queryFn: () => getLectureById(lectureId),
    staleTime: 60_000 * 5
  })

  return (
    <div className="text-white">
      Welcome to the lecture with id: {lecture.id},
      <br />
      name: {lecture.name},
      <br />
      content: {lecture.content}
    </div>
  )
}
