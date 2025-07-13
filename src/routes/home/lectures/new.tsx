import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useFile } from '../../../hooks/useFile';
import FileInput from '../../../components/FileInput';
import TransparentButton from '../../../components/TransparentButton';
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import { useContext, useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLecture } from '../../../services/api';
import { HomeContext } from '../route';

export const Route = createFileRoute('/home/lectures/new')({
  component: NewLecture,
})

function NewLecture() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const homeContext = useContext(HomeContext);

  const [lectureName, setLectureName] = useState("");
  const [lectureContent, setLectureContent] = useState<string | null>(null);
  const { files, onChange, removeFile, clearFiles } = useFile({ multiple: true });

  const { mutateAsync: addLecture } = useMutation({
    mutationFn: (formData: FormData) => createLecture(formData, homeContext!.currentCourseId!),
    onSuccess: (lectureId) => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] })

      router.navigate({
        to: "/home/lectures/$lectureId",
        params: {
          lectureId: lectureId.toString()
        }
      })
    },
    onError: () => {
      alert("An error occured while creating a lecture.")
    }
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", lectureName);

    if (lectureContent !== null) {
      formData.append("content", lectureContent)
    }

    files.forEach((f) => {
      formData.append("files", f);
    })

    await addLecture(formData);
  }

  return (
    <form
      className="bg-black/20 h-full w-full p-4 text-white flex flex-col"
      onSubmit={handleSubmit}
    >
      <div className='flex flex-row justify-between pb-2 border-b-1'>
        <input
          type="text"
          placeholder="New lecture..."
          required
          value={lectureName}
          maxLength={256}
          onChange={(e) => setLectureName(e.target.value)}
          className="focus:outline-none focus:ring-0 text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-2 rounded-4xl placeholder:text-gray-500"
        />
        <div className='flex flex-row'>
          <TransparentButton
            text=""
            iconSrc={AcceptIcon}
            isSubmitType={true}
            disabled={lectureName.trim().length < 3 || files.length < 1}
          />
          <div className='w-2'></div>
          <TransparentButton
            text=""
            iconSrc={DiscardIcon}
            onClick={() => router.navigate({
              to: "/home/courses/$courseId",
              params: {
                courseId: homeContext!.currentCourseId!.toString()
              }
            })}
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
        <h2>Content</h2>
      </div>
      <div className='mt-4 flex-1'>
        <textarea
          placeholder="Content..."
          value={lectureContent || ""}
          onChange={(e) => setLectureContent(e.target.value)}
          className=" text-gray-200 w-full h-full bg-[#1E1E1E] p-4 rounded-4xl placeholder:text-gray-500 focus:outline-none focus:ring-0"
        />
      </div>
    </form>
  )
}
