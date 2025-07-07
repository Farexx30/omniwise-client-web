import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/home/courses/$courseId/members/$memberId',
)({
  component: CourseMember,
})

function CourseMember() {
  return <div>Hello "/home/courses/$courseId/members/$memberId"!</div>
}
