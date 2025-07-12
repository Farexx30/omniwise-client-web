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
  const userContext = useContext(UserContext)!;
  const homeContext = useContext(HomeContext);

  const { data: lecture } = useSuspenseQuery({
    queryKey: ["lecture", lectureId],
    queryFn: () => getLectureById(lectureId),
    staleTime: 60_000 * 5
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: removeLecture } = useMutation({
    mutationFn: deleteLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });

      navigate({
        to: "/home/courses/$courseId",
        params: {
          courseId: homeContext!.currentCourseId!.toString()
        }
      });
    },
    onError: () => {
      alert("An error occured while deleting lecture.")
    }
  });

  const { mutateAsync: modifyLecture } = useMutation({
    mutationFn: (formData: FormData) => updateLecture(formData, lectureId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lectures"] });
      await queryClient.invalidateQueries({ queryKey: ["lecture", lectureId] });
      setIsEditing(!isEditing)
    },
    onError: () => {
      alert("An error occured while updating lecture.")
      setIsEditing(!isEditing)
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [courseName, setCourseName] = useState(lecture.name);
  const [courseContent, setCourseContent] = useState<string | null>(lecture.content);
  const { files, setFiles, onChange, removeFile, clearFiles } = useFile({ multiple: true });

  // !!!IMPORTANT!!!
  // Reset the component state when navigating to different lecture, since React preserves the previous state even if
  // lectureId param from Tanstack Router is different. 
  // If not it would destroy component's behavior when isEditing would be set to true atleast once in the same course.
  useEffect(() => {
    setIsEditing(false);
    setCourseName(lecture.name);
    setCourseContent(lecture.content);
    clearFiles();
  }, [lecture])

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setCourseName(lecture.name);
    setCourseContent(lecture.content);
    clearFiles();
  }, [isEditing])

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", courseName);

    if (courseContent !== null) {
      formData.append("content", courseContent)
    }

    files.forEach((f) => {
      formData.append("files", f);
    })

    await modifyLecture(formData);
  }

  return (
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
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="focus:outline-none focus:ring-0 text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-2 rounded-4xl placeholder:text-gray-500"
          />
          <div className='flex flex-row'>
            <TransparentButton
              text=""
              iconSrc={AcceptIcon}
              isSubmitType={true}
              disabled={courseName.trim().length < 3 || files.length < 1}
            />
            <div className='w-2'></div>
            <TransparentButton
              text=""
              iconSrc={DiscardIcon}
              onClick={() => setIsEditing(!isEditing)}
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
        />
        <div className="flex flex-row justify-between mt-8">
          <h2>Lecture description</h2>
        </div>
        <div className='mt-2 flex-1'>
          <textarea
            placeholder="Content..."
            value={courseContent || ""}
            onChange={(e) => setCourseContent(e.target.value)}
            className=" text-gray-200 w-full h-full bg-[#1E1E1E] p-4 rounded-4xl placeholder:text-gray-500 focus:outline-none focus:ring-0"
          />
        </div>
      </form>
    ) : (
      <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
        <div className='flex flex-row justify-between pb-4 pt-1 border-b-1'>
          <h2>{lecture.name}</h2>
          {userContext.role === "Teacher" && <div className='flex flex-row'>
            <TransparentButton
              text=""
              iconSrc={EditIcon}
              onClick={async () => {
                const existingFiles = await fetchFiles(lecture.files);
                setFiles(existingFiles);
                setIsEditing(!isEditing);
              }}
            />
            <div className='w-2'></div>
            <TransparentButton
              text=""
              iconSrc={TrashIcon}
              onClick={() => removeLecture(lecture.id)}
            />
          </div>}
        </div>
        <div className="flex flex-row justify-between mt-4">
          <h3>Files</h3>
        </div>
        <ReadonlyFileList
          data={lecture.files}
          zipNameForDownloadAll={`${lecture.name}_Files`}
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
}
