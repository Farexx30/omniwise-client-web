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

export interface LocalStorageCourseInfo {
    id: number | null;
    ownerId: string | null;
}

