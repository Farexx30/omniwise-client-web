export type UserRole = "Student" | "Teacher";

export interface AuthenticationSuccessResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

export interface AuthenticationErrorResponse {
    title: string;
    detail: string;
    status: number;
    type: string;
    traceId: string;
}