import { createFileRoute } from '@tanstack/react-router'
import { deleteLecture, getLectureById, updateLecture } from '../../../services/api'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import Spinner from '../../../components/Spinner'
import TransparentButton from '../../../components/TransparentButton'
import TrashIcon from '/white-trash.svg'
import EditIcon from '/edit.svg'
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import ReadonlyFileList from '../../../components/ReadonlyFileList'
import { useContext, useEffect, useState, type FormEvent } from 'react'
import FileInput from '../../../components/FileInput'
import { useFile } from '../../../hooks/useFile'
import { fetchFiles } from '../../../utils/file'
import { HomeContext, UserContext } from '../route'
import { useDebounce } from '../../../hooks/useDebounce'
import LoadingView from '../../../components/LoadingView'
import ErrorComponentView from '../../../components/ErrorComponentView'

export const Route = createFileRoute('/home/lectures/$lectureId')({
  component: Lecture,
  pendingComponent: () => <Spinner />,
  errorComponent: ({ error }) => <ErrorComponentView message={error.message} />,
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
  const userContext = useContext(UserContext)!;
  const homeContext = useContext(HomeContext);

  const { data: lecture } = useSuspenseQuery({
    queryKey: ["lecture", lectureId],
    queryFn: () => getLectureById(lectureId),
    staleTime: 60_000 * 5
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: removeLecture } = useMutation({
    mutationFn: deleteLecture,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lectures"] });

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

  const { mutateAsync: modifyLecture } = useMutation({
    mutationFn: (formData: FormData) => updateLecture(formData, lectureId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lectures"] });
      await queryClient.invalidateQueries({ queryKey: ["lecture", lectureId] });

      setIsSubmitting(false);
      setIsEditing(!isEditing)
    },
    onError: (error) => {
      setIsSubmitting(false);
      setIsEditing(!isEditing)
      alert(error instanceof Error
        ? error.message || "Unknown error"
        : new Error("An unexpected error occurred")
      );
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [lectureName, setLectureName] = useState(lecture.name);
  const [lectureContent, setLectureContent] = useState<string | null>(lecture.content);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

  const { files, setFiles, onChange, removeFile, clearFiles } = useFile({ multiple: true });

  // !!!IMPORTANT!!!
  // Reset the component state when navigating to different lecture, since React preserves the previous state even if
  // lectureId param from Tanstack Router is different. 
  // If not it would destroy component's behavior when isEditing would be set to true atleast once in the same course.
  useEffect(() => {
    setIsEditing(false);
    setLectureName(lecture.name);
    setLectureContent(lecture.content);
    setIsSubmitting(false);
    clearFiles();
  }, [lecture])

  useEffect(() => {
    if (isEditing) {
      return;
    }
    setLectureName(lecture.name);
    setLectureContent(lecture.content);
    clearFiles();
  }, [isEditing])

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", lectureName);

    if (lectureContent !== null) {
      formData.append("content", lectureContent)
    }

    files.forEach((f) => {
      formData.append("files", f);
    })

    await modifyLecture(formData);
  }

  return (
    isSubmittingDebounced && isSubmitting ? (
      <LoadingView />
    ) : (
      isEditing ? (
        <form
          className="bg-black/20 h-full w-full p-4 text-white flex flex-col"
          onSubmit={handleUpdate}
        >
          <div className='flex flex-row justify-between pb-2 border-b-1'>
            <input
              type="text"
              placeholder="New lecture..."
              required
              maxLength={256}
              value={lectureName}
              disabled={isSubmitting}
              onChange={(e) => setLectureName(e.target.value)}
              className="focus:outline-none focus:ring-0 text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-2 rounded-4xl placeholder:text-gray-500"
            />
            <div className='flex flex-row'>
              <TransparentButton
                text=""
                iconSrc={AcceptIcon}
                isSubmitType={true}
                disabled={lectureName.trim().length < 3 || files.length < 1 || isSubmitting}
              />
              <div className='w-2'></div>
              <TransparentButton
                text=""
                iconSrc={DiscardIcon}
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between mt-4">
            <h3>Files</h3>
          </div>
          <FileInput
            data={files}
            onChange={onChange}
            onRemove={removeFile}
            onClear={clearFiles}
            multiple={true}
            disabled={isSubmitting}
          />
          <div className="flex flex-row justify-between mt-8">
            <h2>Lecture description</h2>
          </div>
          <div className='mt-2 flex-1'>
            <textarea
              placeholder="Content..."
              value={lectureContent || ""}
              maxLength={4500}
              onChange={(e) => setLectureContent(e.target.value)}
              disabled={isSubmitting}
              className=" text-gray-200 w-full h-full bg-[#1E1E1E] p-4 rounded-4xl placeholder:text-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
        </form>
      ) : (
        <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
          <div className='flex flex-row justify-between pb-2 border-b-1'>
            <h2
              className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis"
              title={lecture.name}
            >
              {lecture.name}
            </h2>
            {userContext.role === "Teacher" &&
              <div className='flex flex-row'>
                <TransparentButton
                  text=""
                  iconSrc={EditIcon}
                  onClick={async () => {
                    const existingFiles = await fetchFiles(lecture.files);
                    setFiles(existingFiles);
                    setIsEditing(!isEditing);
                  }}
                  disabled={isSubmitting}
                />
                <div className='w-2'></div>
                <TransparentButton
                  text=""
                  iconSrc={TrashIcon}
                  onClick={async () => {
                    setIsSubmitting(true);
                    await removeLecture(lecture.id)
                  }}
                  disabled={isSubmitting}
                />
              </div>}
          </div>
          <div className="flex flex-row justify-between mt-4">
            <h3>Files</h3>
          </div>
          <ReadonlyFileList
            data={lecture.files}
            zipNameForDownloadAll={`${lecture.name}_Files`}
            disabled={isSubmitting}
          />
          <div className="flex flex-row justify-between mt-8">
            <h2>Lecture description</h2>
          </div>
          {lecture.content ? (
            <div className='mt-2 overflow-y-auto flex-1 whitespace-pre-line'>
              {lecture.content}
            </div>
          ) : (
            <p className="italic text-secondary-grey">No description for this lecture.</p>
          )}
        </div>
      )
    )
  )
}
