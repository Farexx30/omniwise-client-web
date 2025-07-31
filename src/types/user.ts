import type { AssignmentSubmissionCourseMemberList } from "./assignmentSubmission";

export type UserRole = "Student" | "Teacher" | "Admin";
export type UserStatus = "Pending" | "Active" | "Archived";

export interface RegisterUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleName: string;
}

export interface UserInfoForAdmin {
    id: string;
    email: string;
    fullName: string;
    roleName: string;
}

export interface BasicUserInfo {
    id: string;
    name: string;
}

export interface CourseMemberWithDetails {
    id: string;
    joinDate: string;
    fullName: string;
    email: string;
    roleName: string;
    assignmentSubmissions?: AssignmentSubmissionCourseMemberList[];
}

export type RegisterResult = "BadRequest" | "Success";
export type LoginResult = "Unauthorized" | "Forbidden" | "Success";

export interface AuthenticationSuccessResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

export interface PendingCourseMember{
    id: string;
    name: string;
    role: string;
}