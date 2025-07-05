export type UserRole = "Student" | "Teacher";

export type AuthenticationResult = "Unauthorized" | "Forbidden" | "Success";

export interface AuthenticationSuccessResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}