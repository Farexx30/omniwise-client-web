import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/home/courses/$courseId')({
  component: CoursesLayout,
})

//Empty, but essential to enforce url structure we want.
function CoursesLayout() {
  return <Outlet />
}
