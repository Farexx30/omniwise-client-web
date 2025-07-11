import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useContext, useState, type FormEvent } from 'react';
import { HomeContext } from '../route';
import FileInput from '../../../components/FileInput';
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import { useFile } from '../../../hooks/useFile';
import TransparentButton from '../../../components/TransparentButton';
import { createAssignment } from '../../../services/api';

export const Route = createFileRoute('/home/assignments/new')({
  component: NewAssignment,
})

function NewAssignment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const homeContext = useContext(HomeContext);

  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentContent, setAssignmentContent] = useState<string | null>(null);
  const [assignmentDeadline, setAssignmentDeadline] = useState<string>("");
  const [assignmentMaxGrade, setAssignmentMaxGrade] = useState("")
  const { files, onChange, removeFile, clearFiles } = useFile({ multiple: true });

  const { mutateAsync: addAssignment } = useMutation({
    mutationFn: (formData: FormData) => createAssignment(formData, homeContext!.currentCourseId!),
    onSuccess: (assignmentId) => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] })

      router.navigate({
        to: "/home/assignments/$assignmentId",
        params: {
          assignmentId: assignmentId.toString()
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
    formData.append("name", assignmentName);

    if (assignmentContent !== null) {
      formData.append("content", assignmentContent)
    }

    formData.append("deadline", assignmentDeadline);
    formData.append("maxGrade", assignmentMaxGrade);

    files.forEach((f) => {
      formData.append("files", f);
    })

    await addAssignment(formData);
  }

  return (
    <form
      className="bg-black/20 h-full w-full p-4 text-white flex flex-col"
      onSubmit={handleSubmit}
    >
      <div className='flex flex-row justify-between pb-2 border-b-1'>
        <input
          type="text"
          placeholder="New assignment..."
          required
          value={assignmentName}
          onChange={(e) => setAssignmentName(e.target.value)}
          className="focus:outline-none focus:ring-0 text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-2 rounded-4xl placeholder:text-gray-500"
        />
        <div className='flex flex-row'>
          <TransparentButton
            text=""
            iconSrc={AcceptIcon}
            isSubmitType={true}
            disabled={assignmentName.trim().length < 3 || files.length < 1}
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
      <div className='flex flex-row pb-2 border-b-1 mt-2'>
        <input
          type="datetime-local"
          required
          min={new Date().toISOString().slice(0, 16)}
          value={assignmentDeadline}
          onChange={(e) => setAssignmentDeadline(e.target.value)}
          className=""
        />
        <span className='ml-8'>
          Maximum grade:
          <input
            type="number"
            placeholder="100"
            min="1"
            required
            value={assignmentMaxGrade}
            onChange={(e) => setAssignmentMaxGrade(e.target.value)}
            className="focus:outline-none focus:ring-0 text-gray-200 bg-[#1E1E1E] p-2 rounded-4xl placeholder:text-gray-500"
          />
        </span>
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
      <div className='mt-4 max-h-24 flex-1'>
        <textarea
          placeholder="Content..."
          value={assignmentContent || ""}
          onChange={(e) => setAssignmentContent(e.target.value)}
          className=" text-gray-200 w-full h-full bg-[#1E1E1E] p-4 rounded-4xl placeholder:text-gray-500 focus:outline-none focus:ring-0"
        />
      </div>
    </form >
  )
}
