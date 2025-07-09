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
    submissions?: Submission[];
}

export interface Submission {
    id: number;
    grade: number;
    latestSubmissionDate: string;
    authorFullName: string;
}
