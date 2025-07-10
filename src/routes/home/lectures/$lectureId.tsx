import { createFileRoute } from '@tanstack/react-router'
import { deleteLecture, getLectureById } from '../../../services/api'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import Spinner from '../../../components/Spinner'
import TransparentButton from '../../../components/TransparentButton'
import TrashIcon from '/white-trash.svg'
import EditIcon from '/edit.svg'
import ReadonlyFileList from '../../../components/ReadonlyFileList'
import type { downloadFile } from '../../../utils/file'

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
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: removeLecture } = useMutation({
    mutationFn: deleteLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      navigate({ to: "/home" });
    },
  });

  return (
    <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
      <div className='flex flex-row justify-between pb-2 border-b-1'>
        <h2>{lecture.name}</h2>
        <div className='flex flex-row'>
          <TransparentButton
            text=""
            iconSrc={EditIcon}
          />
          <div className='w-2'></div>
          <TransparentButton
            text=""
            iconSrc={TrashIcon}
            onClick={() => {
              removeLecture(lecture.id);
            }}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <h3>Files</h3>
      </div>
      <ReadonlyFileList
        data={lecture.files}
        zipNameForDownloadAll={`${lecture.name}_Files`}
      />
      <div className="flex flex-row justify-between mt-8">
        <h2>Content</h2>
      </div>
      <div className='mt-4 overflow-y-auto flex-1'>
        {lecture.content}
      </div>
    </div>
  )
}
