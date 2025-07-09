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
    // will add files etc. in the future.
}