import type { Course } from "../types/course";
import type { AuthenticationResult, AuthenticationSuccessResponse } from "../types/user";

const BASE_API_URL = "https://omniwise-ckhgf2duhhfvgtdp.polandcentral-01.azurewebsites.net/api";

export const login = async(email: string, password: string): Promise<AuthenticationResult> => {
    const url = `${BASE_API_URL}/identity/login`; 
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (response.status === 401) {
        return "Unauthorized"
    }

    if (response.status === 403) {
        return "Forbidden"
    }

    const json = await response.json() as AuthenticationSuccessResponse    
    localStorage.setItem("tokenType", json.tokenType);
    localStorage.setItem("accessToken", json.accessToken);
    localStorage.setItem("expiresIn", json.expiresIn.toString());
    localStorage.setItem("refreshToken", json.refreshToken);

    return "Success";
}


export const getEnrolledCourses = async(): Promise<Course[]> => {
    const url = `${BASE_API_URL}/courses/enrolled`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching enrolled courses: ${response.statusText}`);
    }

    const json = await response.json();
    return json as Course[];
}

export const getAvailableCourses = async(query?: string): Promise<Course[]> => {
    query = query?.trim() || "";
    const url = `${BASE_API_URL}/courses/available?searchPhrase=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching enrolled courses: ${response.statusText}`);
    }

    const json = await response.json();
    return json as Course[];
}