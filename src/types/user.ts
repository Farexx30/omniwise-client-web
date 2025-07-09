export type UserRole = "Student" | "Teacher";

export interface RegisterUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
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
    //will add assignmentSubmissions in the future.
}

export type RegisterResult = "BadRequest" | "Success";

export type LoginResult = "Unauthorized" | "Forbidden" | "Success";

export interface AuthenticationSuccessResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}