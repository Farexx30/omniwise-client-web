import type { FileInfo } from "./file";

export interface BasicAssignmentInfo {
    id: number;
    name: string;
}

export interface Assignment {
    id: number;
    name: string;
    content: string;
    deadline: string;
    maxGrade: number;  
    files: FileInfo[];
    submissions?: Submission[];
}

export interface Submission {
    id: number;
    grade: number;
    latestSubmissionDate: string;
    authorFullName: string;
}

export interface AssignmentSubmission
{
    id: number;
    grade: number;    
    maxGrade: number;
    latestSubmissionDate: string;
    deadline: string;
    comments?: Comment[];
    authorFullName: string;
    assignmentId: number;
    assignmentName: string;
}

export interface Comment
{
    id: number;
    content: string;
    sentDate: string;
    authorFullName: string;
}