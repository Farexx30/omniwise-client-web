import type { BasicAssignmentSubmission } from "./assignmentSubmission";
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
    submissions: BasicAssignmentSubmission[];
}