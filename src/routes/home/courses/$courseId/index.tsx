import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useContext, useEffect, useState, type FormEvent } from 'react';
import ErrorComponentView from '../../../../components/ErrorComponentView';
import FileInput from '../../../../components/FileInput';
import LoadingView from '../../../../components/LoadingView';
import ShadowButton from '../../../../components/ShadowButton';
import Spinner from '../../../../components/Spinner';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useFile } from '../../../../hooks/useFile';
import { getCourseById, updateCourse } from '../../../../services/api';
import type { FileInfo } from '../../../../types/file';
import { fetchFile } from '../../../../utils/file';
import { UserContext } from '../../route';
import AcceptIcon from "/accept-icon.svg";
import DiscardIcon from "/discard-icon.svg";
import EditIcon from '/edit.svg';


export const Route = createFileRoute('/home/courses/$courseId/')({
  component: Course,
  pendingComponent: () => <Spinner />,
  errorComponent: ({ error }) => <ErrorComponentView message={error.message} />,
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
  const queryClient = useQueryClient();
  const userContext = useContext(UserContext)!;

  const { data: course } = useSuspenseQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    staleTime: 60_000 * 5
  })

  const { mutateAsync: modifyCourse } = useMutation({
    mutationFn: (formData: FormData) => updateCourse(formData, courseId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["courses"] })
      await queryClient.invalidateQueries({ queryKey: ["course", courseId] })
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
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [newCourseName, setNewCourseName] = useState(course.name)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

  const { files: imgs, setFiles, onChange, removeFile, clearFiles } = useFile({ multiple: false });

  // !!!IMPORTANT!!!
  // Reset the component state when navigating to different course, since React preserves the previous state even if
  // courseId param from Tanstack Router is different. 
  // If not it would destroy component's behavior when isEditing would be set to true atleast once in the course.
  useEffect(() => {
    setIsEditing(false);
    setNewCourseName(course.name);
    setIsSubmitting(false);
    clearFiles();
  }, [course])

  useEffect(() => {
    if (isEditing) {
      return;
    }
    setNewCourseName(course.name);
    clearFiles();
  }, [isEditing])

  const handleCourseUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", newCourseName)

    if (imgs.length > 0) {
      formData.append("img", imgs[0])
    }

    await modifyCourse(formData);
  }

  return (
    isEditing ? (
      isSubmittingDebounced && isSubmitting ? (
        <LoadingView />
      ) : (
        <form
          className="bg-black/20 h-full w-full p-4 text-white flex flex-col items-center justify-center"
          onSubmit={handleCourseUpdate}>
          <div className="w-full mt-8 px-32">
            <input
              type="text"
              placeholder="New course..."
              required
              value={newCourseName}
              maxLength={256}
              disabled={isSubmitting}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-4 rounded-4xl placeholder:text-gray-500"
            />
          </div>
          <div className="flex flex-col relative w-full mt-8 items-center">
            <p className="mb-2">Course image</p>
            <FileInput
              data={imgs}
              onChange={onChange}
              onRemove={removeFile}
              onClear={clearFiles}
              multiple={false}
              accept="image/png, image/jpg, image/jpeg, image/jfif, image/jiff, image/tiff, image/bmp, image/raw"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-row text-xl mt-8 [&>*]:px-18 w-fit">
            <ShadowButton
              text="Accept"
              iconSrc={AcceptIcon}
              isSubmitType={true}
              disabled={newCourseName.trim().length < 3 || isSubmitting}
            />
            <div className='w-2'></div>
            <ShadowButton
              text="Discard"
              iconSrc={DiscardIcon}
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSubmitting}
            />
          </div>
        </form>
      )
    ) : (
      <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col items-center justify-center">
        <div className="flex break-words break-all hyphens-auto text-center items-center justify-center text-5xl text-white ">
          Welcome to {course.name} 😊
        </div>
        <div className="text-xl mt-8 [&>*]:px-18 w-fit">
          {(userContext.role === "Teacher" && userContext.userId === course.ownerId) &&
            <ShadowButton
              text="Edit"
              iconSrc={EditIcon}
              onClick={async () => {
                if (course.imgUrl && course.imgName) {
                  const fileInfo: FileInfo = {
                    name: course.imgName,
                    url: course.imgUrl
                  }
                  const courseImgFile = await fetchFile(fileInfo);
                  setFiles([courseImgFile]);
                }

                setIsEditing(!isEditing);
              }}
            />
          }
        </div>
      </div>
    )
  )
}
