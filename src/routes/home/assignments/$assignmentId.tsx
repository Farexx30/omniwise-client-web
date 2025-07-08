import { createFileRoute } from '@tanstack/react-router'
import Spinner from '../../../components/Spinner'
import { getAssignmentById } from '../../../services/api'
import { useSuspenseQuery } from '@tanstack/react-query'

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

  return (
    <div className="text-white">
      Welcome to the assignment with id: {assignment.id},
      <br />
      name: {assignment.name},
      <br />
      content: {assignment.content}
            <br />
      deadline: {assignment.deadline}
            <br />
      maxGrade: {assignment.maxGrade}
    </div>
  )
}
