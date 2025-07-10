import type { FileInfo } from "./file";

export interface BasicLectureInfo {
    id: number;
    name: string;
}

export interface Lecture {
    id: number;
    name: string;
    content: string;
    files: FileInfo[]
}