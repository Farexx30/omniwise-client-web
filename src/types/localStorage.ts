import type { UserRole } from "./user";

export interface Auth {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

export interface UserInfo {
    role: UserRole;
    userId: string;
}

export interface CourseInfo {
    id: number | null;
    name: string | null;
}

