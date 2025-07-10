import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Spinner from '../../../components/Spinner'
import { deleteAssignment, getAssignmentById, updateAssignment } from '../../../services/api'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import TransparentButton from '../../../components/TransparentButton'
import TrashIcon from '/white-trash.svg'
import EditIcon from '/edit.svg'
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import { formatDate, formatDateForInput } from '../../../utils/date'
import ReadonlyFileList from '../../../components/ReadonlyFileList'
import { useContext, useEffect, useState, type FormEvent } from 'react'
import { useFile } from '../../../hooks/useFile'
import { fetchFiles } from '../../../utils/file'
import FileInput from '../../../components/FileInput'
import { HomeContext } from '../route'

export const Route = createFileRoute('/home/assignments/$assignmentId')({
  component: Assignment,
  pendingComponent: () => <Spinner />,
  errorComponent: () => <p className="text-red-500">Error.</p>,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["assignment", Number(params.assignmentId)],
      queryFn: () => getAssignmentById(Number(params.assignmentId)),
      staleTime: 60_000 * 5
    })

    return {
      assignmentId: Number(params.assignmentId)
    }
  }
})

function Assignment() {
  const { assignmentId } = Route.useLoaderData();
  const homeContext = useContext(HomeContext);

  const { data: assignment } = useSuspenseQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
    staleTime: 60_000 * 5
  })

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: removeAssignment } = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      navigate({
        to: "/home/courses/$courseId",
        params: {
          courseId: homeContext!.currentCourseId!.toString()
        }
      });
    },
  });

  const { mutateAsync: modifyAssignment } = useMutation({
    mutationFn: (formData: FormData) => updateAssignment(formData, assignmentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
      await queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
      setIsEditing(!isEditing)
    },
    onError: () => {
      alert("An error occured while updating assignment.")
      setIsEditing(!isEditing)
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [assignmentName, setAssignmentName] = useState(assignment.name);
  const [assignmentContent, setAssignmentContent] = useState<string | null>(assignment.content);
  const [assignmentDeadline, setAssignmentDeadline] = useState<string>(formatDateForInput(assignment.deadline));
  const [assignmentMaxGrade, setAssignmentMaxGrade] = useState(assignment.maxGrade.toString())
  const { files, setFiles, onChange, removeFile, clearFiles } = useFile({ multiple: true });

  // !!!IMPORTANT!!!
  // Reset the component state when navigating to different lecture, since React preserves the previous state even if
  // lectureId param from Tanstack Router is different. 
  // If not it would destroy component's behavior when isEditing would be set to true atleast once in the same course.
  useEffect(() => {
    setIsEditing(false);
    setAssignmentName(assignment.name);
    setAssignmentContent(assignment.content);
    setAssignmentDeadline(formatDateForInput(assignment.deadline))
    setAssignmentMaxGrade(assignment.maxGrade.toString())
    clearFiles();
  }, [assignment])

  useEffect(() => {
    if (isEditing) {
      return;
    }
    setAssignmentName(assignment.name);
    setAssignmentContent(assignment.content);
    setAssignmentDeadline(formatDateForInput(assignment.deadline))
    setAssignmentMaxGrade(assignment.maxGrade.toString())
    clearFiles();
  }, [isEditing])

  const handleUpdate = async (e: FormEvent) => {
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

    await modifyAssignment(formData);
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
              onClick={() => setIsEditing(!isEditing)}
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
        <div className='mt-4 overflow-y-auto flex-1'>
          <h3 className='mt-4'>Submissions:</h3>
          {assignment.submissions && assignment.submissions.length > 0 ? (
            <ul>
              {assignment.submissions.map(s => (
                <li key={s.id} className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                  <p><strong> {s.authorFullName}</strong></p>
                  <div className="flex flex-row ">
                    <p><strong>Grade:</strong> {s.grade !== null ? s.grade : "-"}/{assignment.maxGrade}</p>
                    <p className='ml-8'><strong>Date:</strong> {formatDate(s.latestSubmissionDate)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-secondary-grey">No submissions yet.</p>
          )}
        </div>
      </form >
    ) : (
      <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
        <div className='flex flex-row justify-between pb-2 border-b-1'>
          <h2>{assignment.name}</h2>
          <div className='flex flex-row'>
            <TransparentButton
              text=""
              iconSrc={EditIcon}
              onClick={async () => {
                const existingFiles = await fetchFiles(assignment.files);
                setFiles(existingFiles);
                setIsEditing(!isEditing);
              }}
            />
            <div className='w-2'></div>
            <TransparentButton text=""
              iconSrc={TrashIcon}
              onClick={() => {
                removeAssignment(assignment.id);
              }} />
          </div>
        </div>
        <div className='flex flex-row pb-2 border-b-1 mt-2'>
          <span>{formatDate(assignment.deadline)}</span>
          <span className='ml-8'>Maximum grade: {assignment.maxGrade}</span>
        </div>
        <div className="flex flex-row justify-between mt-4">
          <h3>Files</h3>
        </div>
        <ReadonlyFileList
          data={assignment.files}
          zipNameForDownloadAll={`${assignment.name}_Files`}
        />
        <div className="flex flex-row justify-between mt-8">
          <h2>Content</h2>
        </div>
        <div className='mt-4 overflow-y-auto flex-1'>
          {assignment.content}
          <h3 className='mt-4'>Submissions:</h3>
          {assignment.submissions && assignment.submissions.length > 0 ? (
            <ul>
              {assignment.submissions.map(s => (
                <li key={s.id} className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                  <p><strong> {s.authorFullName}</strong></p>
                  <div className="flex flex-row ">
                    <p><strong>Grade:</strong> {s.grade !== null ? s.grade : "-"}/{assignment.maxGrade}</p>

                    <p className='ml-8'><strong>Date:</strong> {formatDate(s.latestSubmissionDate)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-secondary-grey">No submissions yet.</p>
          )}
        </div>
      </div>
    )
  )
}
