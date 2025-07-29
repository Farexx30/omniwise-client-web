import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import TransparentButton from '../../../components/TransparentButton';
import { formatDate } from '../../../utils/date';
import { useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Spinner from '../../../components/Spinner';
import { createAssignmentSubmissionComment, deleteAssignmentSubmission, getAssignmentSubmissionById, updateAssignmentSubmission, updateAssignmentSubmissionGrade } from '../../../services/api';
import { Children, useContext, useState, type JSX, type ReactNode } from 'react';
import ReadonlyFileList from '../../../components/ReadonlyFileList';
import FileInput from '../../../components/FileInput';
import { useFile } from '../../../hooks/useFile';
import TrashIcon from '/white-trash.svg'
import EditIcon from '/edit.svg'
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import { fetchFiles } from '../../../utils/file';
import ConditionalWrapper from '../../../components/ConditionalWrapper';
import CommentView from '../../../components/CommentView';
import { UserContext } from '../route';
import { useDebounce } from '../../../hooks/useDebounce';
import LoadingView from '../../../components/LoadingView';


export const Route = createFileRoute('/home/assignment-submissions/$assignmentSubmissionId')({
  component: AssignmentSubmission,
  pendingComponent: () => <Spinner />,
  errorComponent: () => <p className="text-red-500">Error.</p>,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["assignmentSubmission", Number(params.assignmentSubmissionId)],
      queryFn: () => getAssignmentSubmissionById(Number(params.assignmentSubmissionId)),
      staleTime: 60_000 * 5
    })

    return {
      assignmentSubmissionId: Number(params.assignmentSubmissionId)
    };
  }
})


function AssignmentSubmission() {
  const { assignmentSubmissionId } = Route.useLoaderData();
  const router = useRouter();
  const { userId, role } = useContext(UserContext)!;

  const { data: assignmentSubmission } = useSuspenseQuery({
    queryKey: ["assignmentSubmission", assignmentSubmissionId],
    queryFn: () => getAssignmentSubmissionById(assignmentSubmissionId),
    staleTime: 60_000 * 5
  })

  const queryClient = useQueryClient();

  const { mutateAsync: addComment, isPending } = useMutation({
    mutationFn: (content: string) => createAssignmentSubmissionComment(assignmentSubmissionId, content),
    onSuccess: async () => {
      setNewComment("");
      setIsSubmitting(false);
      await queryClient.invalidateQueries({ queryKey: ["assignmentSubmission", assignmentSubmissionId] });
    },
    onError: () => {
      setIsSubmitting(false);
      alert("Failed to add comment.");
    }
  });

  const { mutateAsync: removeAssignmentSubmission } = useMutation({
    mutationFn: deleteAssignmentSubmission,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignment", assignmentSubmission.assignmentId] });

      router.navigate({
        to: "/home/assignments/$assignmentId",
        params: {
          assignmentId: assignmentSubmission.assignmentId.toString()
        }
      });
    },
    onError: () => {
      setIsSubmitting(false);
      alert("An error occured while deleting assignment submission.")
    },
  });

  const { mutateAsync: modifyAssignmentSubmission } = useMutation({
    mutationFn: (formData: FormData) => updateAssignmentSubmission(formData, assignmentSubmissionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignmentSubmission", assignmentSubmissionId] });
      setIsSubmitting(false);
      setIsEditing(!isEditing)
    },
    onError: () => {
      setIsSubmitting(false);
      setIsEditing(!isEditing)
      alert("An error occured while updating assignment submission.")
    },
  });

  const { mutateAsync: updateGrade } = useMutation({
    mutationFn: (grade: number | null) => updateAssignmentSubmissionGrade(assignmentSubmissionId, grade),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignmentSubmission", assignmentSubmissionId] });
      await queryClient.invalidateQueries({ queryKey: ["assignment", assignmentSubmission.assignmentId] });

      setIsSubmitting(false);
      setIsGrading(!isGrading)

      const trimmedGrade = grade?.trim();
      const gradeAsNumber = trimmedGrade === "" || trimmedGrade === null
        ? null
        : Number(trimmedGrade);
      setGrade(gradeAsNumber?.toString() || null);
    },
    onError: () => {
      setIsSubmitting(false);
      setIsGrading(!isGrading);
      setGrade(assignmentSubmission.grade?.toString() || null);
      alert("An error occured while updating grade.")
    },
  });


  const [isEditing, setIsEditing] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(assignmentSubmission.grade?.toString() || null)
  const [newComment, setNewComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingDebounced = useDebounce(isSubmitting, 2000);

  const { files, setFiles, onChange, removeFile, clearFiles } = useFile({ multiple: true });


  const handleCommentCreation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    await addComment(newComment);
  };

  const handleAssignmentSubmissionUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);

    const formData = new FormData();

    files.forEach((f) => {
      formData.append("files", f);
    })

    await modifyAssignmentSubmission(formData);
  }

  const handleGradeUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true);

    const trimmedGrade = grade?.trim();
    const gradeAsNumber = trimmedGrade === "" || trimmedGrade === null
      ? null
      : Number(trimmedGrade);    

    await updateGrade(gradeAsNumber);
  }

  return (
    isSubmittingDebounced && isSubmitting ? (
      <LoadingView />
    ) : (
      <div className="bg-black/20 h-full w-full p-4 text-white flex flex-col">
        <ConditionalWrapper
          condition={isEditing}
          wrapper={(children) => <form onSubmit={handleAssignmentSubmissionUpdate}>{children}</form>}
        >
          <div className='flex flex-row justify-between pb-2 border-b-1'>
            <h2
              className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis"
              title={assignmentSubmission.assignmentName}
            >
              {assignmentSubmission.assignmentName}
            </h2>
            {role === "Student" &&
              <div className='flex flex-row'>
                {isEditing ? (
                  <>
                    <TransparentButton
                      text=""
                      iconSrc={AcceptIcon}
                      isSubmitType={true}
                      disabled={files.length < 1 || isSubmitting}
                    />
                    <div className='w-2'></div>
                    <TransparentButton
                      text=""
                      iconSrc={DiscardIcon}
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={isSubmitting}
                    />
                  </>
                ) : (
                  <>
                    <TransparentButton
                      text=""
                      iconSrc={EditIcon}
                      onClick={async () => {
                        const existingFiles = await fetchFiles(assignmentSubmission.files);
                        setFiles(existingFiles);
                        setIsEditing(!isEditing);
                      }}
                      disabled={isSubmitting}
                    />
                    <div className='w-2'></div>
                    <TransparentButton text=""
                      iconSrc={TrashIcon}
                      onClick={async() => {
                        setIsSubmitting(true);
                        await removeAssignmentSubmission(assignmentSubmission.id)
                      }}
                      disabled={isSubmitting}
                    />
                  </>
                )}
              </div>}
          </div>
          <div className='flex flex-row pb-2 border-b-1 mt-2 justify-between'>
            <span><strong>Author: </strong> {assignmentSubmission.authorFullName}</span>
            <span><strong>Submission date:</strong> {formatDate(assignmentSubmission.latestSubmissionDate)}</span>
            <span><strong>Deadline:</strong> {formatDate(assignmentSubmission.deadline)}</span>
          </div>
          <div className="flex flex-row justify-between mt-4">
            <h3>Files</h3>
          </div>
          {
            isEditing ? (
              <FileInput
                data={files}
                onChange={onChange}
                onRemove={removeFile}
                onClear={clearFiles}
                multiple={true}
                disabled={isSubmitting}
              />
            ) : (
              <ReadonlyFileList
                data={assignmentSubmission.files}
                zipNameForDownloadAll={`${assignmentSubmission.authorFullName}_${assignmentSubmission.assignmentName}_Files`}
                disabled={isSubmitting}
              />
            )
          }
        </ConditionalWrapper>
        <h3>Grade:</h3>
        {isGrading ? (
          <form onSubmit={handleGradeUpdate} className='flex flex-row'>
            <input
              type="number"
              placeholder={assignmentSubmission.maxGrade.toString()}
              min="0"
              max={assignmentSubmission.maxGrade}
              value={grade || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length < 7) {
                  setGrade(e.target.value)
                }
              }}
              disabled={isSubmitting}
              className="focus:outline-none focus:ring-0 text-gray-200 bg-[#1E1E1E] py-2 w-12 rounded-4xl placeholder:text-gray-500"
            />
            <span className='text-xl mr-4 mt-1'>/{assignmentSubmission.maxGrade}</span>
            <div className='flex flex-row'>
              <TransparentButton
                text=""
                iconSrc={AcceptIcon}
                isSubmitType={true}
                disabled={isSubmitting}
              />
              <div className='w-2'></div>
              <TransparentButton
                text=""
                iconSrc={DiscardIcon}
                onClick={() => {
                  setIsGrading(!isGrading)
                  setGrade(assignmentSubmission.grade?.toString() || null)
                }}
                disabled={isSubmitting}
              />
            </div>
          </form>
        ) : (
          <div className='flex flex-row'>
            <span className='text-xl mr-4'>
              {assignmentSubmission.grade != null ? assignmentSubmission.grade : "-"}
              /{assignmentSubmission.maxGrade}
            </span>
            {role === "Teacher" &&
              <div className='flex flex-row'>
                <TransparentButton text=""
                  iconSrc={EditIcon}
                  onClick={() => setIsGrading(!isGrading)}
                  disabled={isSubmitting}
                />
              </div>
            }
          </div>
        )}

        <h3 className='mt-4'>Comments:</h3>
        <div className='overflow-y-auto flex-1 overflow-x-hidden w-full pr-2'>
          {assignmentSubmission.comments && assignmentSubmission.comments.length > 0 ? (
            <ul>
              {assignmentSubmission.comments.map(c => (
                <li key={c.id} className={`flex flex-col ${c.authorId === userId ? "bg-primary/80" : "bg-white/10"} rounded-lg p-4 shadow-md my-4`}>
                  <CommentView
                    assignmentSubmissionId={assignmentSubmissionId}
                    disableControls={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    {...c}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-secondary-grey">No comments yet.</p>
          )}
          <form onSubmit={handleCommentCreation} className="mt-6 items-center flex flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              placeholder="Add a comment..."
              className={`w-full bg-white/10 text-white p-2 rounded-lg resize-none border-none focus:outline-none`}
              required
              maxLength={2000}
              disabled={isSubmitting}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  if (!e.currentTarget.value.trim()) {
                    e.preventDefault();
                    return;
                  }

                  await handleCommentCreation(e)
                }
              }}
            />
            <button
              type="submit"
              disabled={newComment.trim() === "" || isPending || isSubmitting}
              className="mt-2 ml-4 mr-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-full disabled:opacity-50 hover:drop-shadow-[0_0_8px_rgba(140,71,246,1)] transition mb-3 disabled:bg-gray-500 disabled:cursor-default disabled:hover:drop-shadow-none"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    )
  )
}
