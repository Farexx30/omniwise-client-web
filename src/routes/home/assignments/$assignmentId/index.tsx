import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useContext, useEffect, useState, type FormEvent } from 'react'
import AssignmentSubmission from '../../../../components/AssignmentSubmission'
import ErrorComponentView from '../../../../components/ErrorComponentView'
import FileInput from '../../../../components/FileInput'
import LoadingView from '../../../../components/LoadingView'
import ReadonlyFileList from '../../../../components/ReadonlyFileList'
import Spinner from '../../../../components/Spinner'
import TransparentButton from '../../../../components/TransparentButton'
import TransparentLink from '../../../../components/TransparentLink'
import { useDebounce } from '../../../../hooks/useDebounce'
import { useFile } from '../../../../hooks/useFile'
import { deleteAssignment, getAssignmentById, updateAssignment } from '../../../../services/api'
import { formatDate, formatDateForInput } from '../../../../utils/date'
import { fetchFiles } from '../../../../utils/file'
import { HomeContext, UserContext } from '../../route'
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import EditIcon from '/edit.svg'
import PlusIcon from '/plus.svg'
import TrashIcon from '/white-trash.svg'


export const Route = createFileRoute('/home/assignments/$assignmentId/')({
  component: Assignment,
  pendingComponent: () => <Spinner />,
  errorComponent: ({ error }) => <ErrorComponentView message={error.message} />,
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
  const userContext = useContext(UserContext)!;
  const homeContext = useContext(HomeContext);

  const { data: assignment } = useSuspenseQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
    staleTime: 60_000 * 5
  })

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: removeAssignment } = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
      await queryClient.invalidateQueries({ queryKey: ["courseMember"] });

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
    },
  });

  const { mutateAsync: modifyAssignment } = useMutation({
    mutationFn: (formData: FormData) => updateAssignment(formData, assignmentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
      await queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
      await queryClient.invalidateQueries({ queryKey: ["assignmentSubmission"] });
      await queryClient.invalidateQueries({ queryKey: ["courseMember"] });
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
  const [assignmentName, setAssignmentName] = useState(assignment.name);
  const [assignmentContent, setAssignmentContent] = useState<string | null>(assignment.content);
  const [assignmentDeadline, setAssignmentDeadline] = useState<string>(formatDateForInput(assignment.deadline));
  const [assignmentMaxGrade, setAssignmentMaxGrade] = useState(assignment.maxGrade.toString())

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

  const { files, setFiles, onChange, removeFile, clearFiles } = useFile({ multiple: true });

  // !!!IMPORTANT!!!
  // Reset the component state when navigating to different lecture, since React preserves the previous state even if
  // assignmentId param from Tanstack Router is different. 
  // If not it would destroy component's behavior when isEditing would be set to true atleast once in the same course.
  useEffect(() => {
    setIsEditing(false);
    setAssignmentName(assignment.name);
    setAssignmentContent(assignment.content);
    setAssignmentDeadline(formatDateForInput(assignment.deadline))
    setAssignmentMaxGrade(assignment.maxGrade.toString())
    setIsSubmitting(false);
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
    setIsSubmitting(true);

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
              placeholder="New assignment..."
              required
              maxLength={256}
              value={assignmentName}
              disabled={isSubmitting}
              onChange={(e) => setAssignmentName(e.target.value)}
              className="focus:outline-none focus:ring-0 text-2xl border-gray-700 text-gray-200 w-full h-full bg-[#1E1E1E] p-2 rounded-4xl placeholder:text-gray-500"
            />
            <div className='flex flex-row'>
              <TransparentButton
                text=""
                iconSrc={AcceptIcon}
                isSubmitType={true}
                disabled={assignmentName.trim().length < 3 || files.length < 1 || isSubmitting}
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
          <div className='flex flex-row pb-2 border-b-1 mt-2'>
            <span className="mt-2 mr-1">Deadline: </span>
            <input
              type="datetime-local"
              required
              min={new Date().toISOString().slice(0, 16)}
              value={assignmentDeadline}
              disabled={isSubmitting}
              onChange={(e) => setAssignmentDeadline(e.target.value)}
            />
            <span className='ml-8'>
              <span className="mr-1">Maximum grade: </span>
              <input
                type="number"
                placeholder="100"
                min="1"
                required
                value={assignmentMaxGrade}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length < 7) {
                    setAssignmentMaxGrade(e.target.value)
                  }
                }}
                disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          <div className="flex flex-row justify-between mt-8">
            <h2>Assignment description</h2>
          </div>
          <div className='mt-2 flex-1'>
            <textarea
              placeholder="Content..."
              value={assignmentContent || ""}
              maxLength={4500}
              disabled={isSubmitting}
              onChange={(e) => setAssignmentContent(e.target.value)}
              className=" text-gray-200 w-full h-full bg-[#1E1E1E] p-4 rounded-4xl placeholder:text-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
          <div className='mt-4 overflow-y-auto flex-1'>
            <h3 className='mt-4'>Submissions:</h3>
            {assignment.submissions && assignment.submissions.length > 0 ? (
              <ul>
                {assignment.submissions.map(s => (
                  <li key={s.id}>
                    <Link
                      to="/home/assignment-submissions/$assignmentSubmissionId"
                      params={{ assignmentSubmissionId: s.id.toString() }}
                      disabled={isSubmitting}
                    >
                      <div className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                        <AssignmentSubmission
                          submission={s}
                          assignmentMaxGrade={assignment.maxGrade}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-secondary-grey">No submissions yet.</p>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
          <div className='flex flex-row justify-between pb-2 border-b-1'>
            <h2
              className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis"
              title={assignment.name}
            >
              {assignment.name}
            </h2>
            {userContext.role === "Teacher" && <div className="flex flex-row">
              <TransparentButton
                text=""
                iconSrc={EditIcon}
                onClick={async () => {
                  const existingFiles = await fetchFiles(assignment.files);
                  setFiles(existingFiles);
                  setIsEditing(!isEditing);
                }}
                disabled={isSubmitting}
              />
              <div className='w-2'></div>
              <TransparentButton text=""
                iconSrc={TrashIcon}
                onClick={async () => {
                  setIsSubmitting(true);
                  await removeAssignment(assignment.id);
                }}
                disabled={isSubmitting}
              />
            </div>}
          </div>
          <div className='flex flex-row pb-2 border-b-1 mt-2'>
            <span><strong>Deadline: </strong>{formatDate(assignment.deadline)}</span>
            <span className='ml-8'><strong>Maximum grade: </strong>{assignment.maxGrade}</span>
          </div>
          <div className="flex flex-row justify-between mt-4">
            <h3>Files</h3>
          </div>
          <ReadonlyFileList
            data={assignment.files}
            zipNameForDownloadAll={`${assignment.name}_Files`}
            disabled={isSubmitting}
          />
          <div className="flex flex-row justify-between mt-8">
            <h2>Assignment description</h2>
          </div>

          <div className='overflow-y-auto flex-1'>
            {assignment.content ? (
              <div className='mt-2 overflow-y-auto flex-1 whitespace-pre-line'>
                {assignment.content}
              </div>
            ) : (
              <p className="italic text-secondary-grey">No description for this assignment.</p>
            )}
            {userContext.role === "Teacher" ? (
              <>
                <h3 className='mt-4'>Submissions:</h3>
                {assignment.submissions && assignment.submissions.length > 0 ? (
                  <ul>
                    {assignment.submissions.map(s => (
                      <li key={s.id}>
                        <Link
                          to="/home/assignment-submissions/$assignmentSubmissionId"
                          params={{ assignmentSubmissionId: s.id.toString() }}
                          disabled={isSubmitting}
                        >
                          <div className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                            <AssignmentSubmission
                              submission={s}
                              assignmentMaxGrade={assignment.maxGrade}
                            />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-secondary-grey">No submissions yet.</p>
                )}
              </>
            ) : (
              <>
                <h3 className='mt-4'>Your Submission:</h3>
                {assignment.submissions.length > 0 ? (
                  <Link
                    to="/home/assignment-submissions/$assignmentSubmissionId"
                    params={{ assignmentSubmissionId: assignment.submissions[0].id.toString() }}
                  >
                    <div className="flex flex-row justify-between bg-white/10 rounded-lg p-4 shadow-md my-4">
                      <AssignmentSubmission
                        submission={assignment.submissions[0]}
                        assignmentMaxGrade={assignment.maxGrade}
                      />
                    </div>
                  </Link>
                ) : (
                  <>
                    <p className="italic text-secondary-grey">You haven't submitted yet.</p>
                    <div className="mt-2">
                      <TransparentLink
                        to="/home/assignments/$assignmentId/new-submission"
                        params={{
                          assignmentId: assignmentId.toString()
                        }}
                        text="Add submission"
                        textSize="text-xl"
                        iconSrc={PlusIcon}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )
    )
  )
}
