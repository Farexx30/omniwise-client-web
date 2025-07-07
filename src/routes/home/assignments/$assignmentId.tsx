import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/assignments/$assignmentId')({
  component: Assignment,
})

function Assignment() {
  return <div>Hello "/home/assignments/$assignmentId"!</div>
}
