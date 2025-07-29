import React, { useContext, useEffect, useState } from 'react'
import { formatDate } from '../utils/date'
import TransparentButton from './TransparentButton';
import TrashIcon from '/white-trash.svg'
import EditIcon from '/edit.svg'
import AcceptIcon from "/accept-icon.svg"
import DiscardIcon from "/discard-icon.svg"
import ConditionalWrapper from './ConditionalWrapper';
import { UserContext } from '../routes/home/route';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAssignmentSubmission, deleteAssignmentSubmissionComment, updateAssignmentSubmission, updateAssignmentSubmissionComment } from '../services/api';

interface CommentViewProps {
    id: number;
    assignmentSubmissionId: number;
    authorId: string;
    authorFullName: string;
    sentDate: string;
    content: string;
    disableControls?: boolean;
    setIsSubmitting?: (isSubmitting: boolean) => void;
}

const CommentView = ({ id, assignmentSubmissionId, authorId, authorFullName, sentDate, content, disableControls, setIsSubmitting }: CommentViewProps) => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const { userId } = useContext(UserContext)!;

    const { mutateAsync: updateComment } = useMutation({
        mutationFn: (content: string) => updateAssignmentSubmissionComment(id, content),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["assignmentSubmission", assignmentSubmissionId] });
            setIsSubmitting?.(false);
            setIsEditing(!isEditing);
            setNewContent(newContent.trim());
        },
        onError: () => {
            setIsSubmitting?.(false);
            setIsEditing(!isEditing)
            alert("An error occured while updating assignment submission comment.")
        },
    });

    const { mutateAsync: deleteComment } = useMutation({
        mutationFn: deleteAssignmentSubmissionComment,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["assignmentSubmission", assignmentSubmissionId] });
            setIsSubmitting?.(false);
        },
        onError: () => {
            setIsSubmitting?.(false);
            alert("An error occured while deleting assignment submission comment.")
        },
    });

    const handleCommentUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newContent.trim()) {
            return;
        }

        setIsSubmitting?.(true);
        await updateComment(newContent)
    }

    const handleCommentDelete = async () => {
        setIsSubmitting?.(true);
        await deleteComment(id);
    }

    return (
        <ConditionalWrapper
            condition={isEditing}
            wrapper={(children) => <form onSubmit={async (e) => handleCommentUpdate(e)}>{children}</form>}
        >
            <div className="flex flex-row justify-between items-start">
                <p><strong>{authorFullName}</strong></p>
                <div className="flex flex-row items-center gap-4">
                    <p>{formatDate(sentDate)}</p>
                    {authorId === userId &&
                        <div className="flex flex-row items-center gap-1">
                            {isEditing ? (
                                <>
                                    <TransparentButton
                                        text=""
                                        iconSrc={AcceptIcon}
                                        isSubmitType={true}
                                        disabled={newContent.trim().length < 1 || disableControls}
                                    />
                                    <TransparentButton
                                        text=""
                                        iconSrc={DiscardIcon}
                                        onClick={() => {
                                            setIsEditing(!isEditing)
                                            setNewContent(content);
                                        }}
                                        disabled={disableControls}
                                    />
                                </>
                            ) : (
                                <>
                                    <TransparentButton
                                        text=""
                                        iconSrc={EditIcon}
                                        onClick={() => setIsEditing(!isEditing)}
                                        disabled={disableControls}
                                    />
                                    <TransparentButton
                                        text=""
                                        iconSrc={TrashIcon}
                                        onClick={async () => handleCommentDelete()}
                                        disabled={disableControls}
                                    />
                                </>
                            )}
                        </div>
                    }
                </div>
            </div>
            {isEditing ? (
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={2}
                    placeholder="Content..."
                    className="w-full bg-white/10 text-white p-2 rounded-lg resize-none border-none focus:outline-none"
                    required
                    onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            if (!e.currentTarget.value.trim()) {
                                e.preventDefault();
                                return;
                            }

                            await handleCommentUpdate(e)
                        }
                    }}
                />
            ) : (
                <p className="break-words whitespace-pre-wrap w-full max-w-full">
                    {content}
                </p>
            )}
        </ConditionalWrapper>
    )
}

export default CommentView