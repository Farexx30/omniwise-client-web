import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/lectures/$lectureId')({
  component: Lecture,
})

function Lecture() {
  return <div>Hello "/home/lectures/$lectureId"!</div>
}
