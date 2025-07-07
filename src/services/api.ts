import type { Course } from "../types/course";
import type { NotificationDetails } from "../types/notification";
import type {  AuthenticationSuccessResponse, LoginResult, RegisterResult, RegisterUser } from "../types/user";

const BASE_API_URL = "https://omniwise-ckhgf2duhhfvgtdp.polandcentral-01.azurewebsites.net/api";
const BASE_API_URL_DEV = "https://localhost:7155/api"

export const register = async(user: RegisterUser): Promise<RegisterResult> => {
    const url = `${BASE_API_URL_DEV}/identity/register`; 
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            email: user.email, 
            password: user.password, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            roleName: user.roleName 
        })
    });

    if (response.status === 400) {
        return "BadRequest";
    }

    return "Success";
}

export const login = async(email: string, password: string): Promise<LoginResult> => {
    const url = `${BASE_API_URL_DEV}/identity/login`; 
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
    const url = `${BASE_API_URL_DEV}/courses/enrolled`;
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
    console.log(query)
    const url = `${BASE_API_URL_DEV}/courses/available?searchPhrase=${encodeURIComponent(query)}`;
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

export const getNotifications = async(): Promise<NotificationDetails[]> => {
    const url = `${BASE_API_URL_DEV}/notifications`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching notifications: ${response.statusText}`);
    }

    const json = await response.json();
    return json as NotificationDetails[];
}

export const deleteNotification = async(id: number) => {
    const url = `${BASE_API_URL_DEV}/notifications/${id}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) { 
        throw new Error(`Error while deleting notification: ${response.statusText}`);
    }
}