import type { FileInfo } from "./file";

export interface BasicAssignmentSubmission {
    id: number;
    grade: number;
    latestSubmissionDate: string;
    authorFullName: string;
}

export interface AssignmentSubmission
{
    id: number;
    grade: number | null;    
    maxGrade: number;
    latestSubmissionDate: string;
    deadline: string;
    comments?: Comment[];
    authorFullName: string;
    assignmentId: number;
    assignmentName: string;
    files: FileInfo[];
}

export interface AssignmentSubmissionCourseMemberList
{
    id: number;
    name: string;
    latestSubmissionDate: string;
    deadline: string;
    grade: number;
}

export interface Comment
{
    id: number;
    content: string;
    sentDate: string;
    authorId: string;
    authorFullName: string;
}