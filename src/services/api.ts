import type { Assignment, BasicAssignmentInfo } from "../types/assignment";
import type { Course } from "../types/course";
import type { NotificationDetails } from "../types/notification";
import type { BasicLectureInfo, Lecture } from "../types/lecture";
import type { AuthenticationSuccessResponse, BasicUserInfo, CourseMemberWithDetails, LoginResult, RegisterResult, RegisterUser } from "../types/user";

const BASE_API_URL = "https://omniwise-ckhgf2duhhfvgtdp.polandcentral-01.azurewebsites.net/api";
const BASE_API_URL_DEV = "https://localhost:7155/api"

export const register = async (user: RegisterUser): Promise<RegisterResult> => {
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

export const login = async (email: string, password: string): Promise<LoginResult> => {
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


export const getEnrolledCourses = async (query?: string): Promise<Course[]> => {
    query = query?.trim() || "";
    const url = `${BASE_API_URL_DEV}/courses/enrolled?searchPhrase=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching enrolled courses: ${response.statusText}`);
    }

    const json = await response.json();
    return json as Course[];
}

export const getAvailableCourses = async (query?: string): Promise<Course[]> => {
    query = query?.trim() || "";
    console.log(query)
    const url = `${BASE_API_URL_DEV}/courses/available?searchPhrase=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching enrolled courses: ${response.statusText}`);
    }

    const json = await response.json();
    return json as Course[];
}

export const getNotifications = async (): Promise<NotificationDetails[]> => {
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

export const deleteNotification = async (id: number) => {
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

export const enrollInCourse = async (courseId: number): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/courses/${courseId}/members`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Error enrolling in course: ${response.statusText}`);
    }
}

export const getCourseById = async (id: number): Promise<Course> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching course: ${response.statusText}`);
    }

    const json = await response.json();
    return json as Course;
}


export const getLecturesByCourseId = async (id: number): Promise<BasicLectureInfo[]> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(id)}/lectures`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching lectures for course: ${response.statusText}`);
    }

    const json = await response.json();
    return json as BasicLectureInfo[];
}

export const getAssignmentsByCourseId = async (id: number): Promise<BasicAssignmentInfo[]> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(id)}/assignments`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching assignments for course: ${response.statusText}`);
    }

    const json = await response.json();
    return json as BasicAssignmentInfo[];
}

export const getMembersByCourseId = async (id: number): Promise<BasicUserInfo[]> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(id)}/members/enrolled`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching members for course: ${response.statusText}`);
    }

    const json = await response.json();
    const result: BasicUserInfo[] = Array.isArray(json)
        ? json.map((prop: { userId: string; firstName: string, lastName: string; }) => ({
            id: prop.userId,
            name: `${prop.firstName} ${prop.lastName}`
        }))
        : [];
    return result;
}

export const getLectureById = async (id: number): Promise<Lecture> => {
    const url = `${BASE_API_URL_DEV}/lectures/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching lecture: ${response.statusText}`);
    }

    const json = await response.json();
    const result: Lecture = {
        ...json,
        files: json.fileInfos
    }
    return result;
}

export const getAssignmentById = async (id: number): Promise<Assignment> => {
    const url = `${BASE_API_URL_DEV}/assignments/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching assignment: ${response.statusText}`);
    }

    const json = await response.json();
    return json as Assignment;
}

export const getCourseMemberById = async (courseId: number, memberId: string): Promise<CourseMemberWithDetails> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(courseId)}/members/${encodeURIComponent(memberId)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching course member: ${response.statusText}`);
    }

    const json = await response.json();
    const result: CourseMemberWithDetails = {
        ...json,
        id: json.userId,
        fullName: `${json.firstName} ${json.lastName}`
    }
    return result;
}

export const deleteLecture = async (id: number) => {
    const url = `${BASE_API_URL_DEV}/lectures/${id}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error while deleting lecture: ${response.statusText}`);
    }
}

export const createCourse = async (formData: FormData): Promise<number> => {
    const url = `${BASE_API_URL_DEV}/courses`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error creating a new course: ${response.statusText}`);
    }

    const json = await response.json();
    return json.courseId;
}

export const updateLecture = async (formData: FormData, lectureId: number): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/lectures/${encodeURIComponent(lectureId)}`;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error updating lecture: ${response.statusText}`);
    }
}

export const createLecture = async (formData: FormData, courseId: number): Promise<number> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(courseId)}/lectures`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `${localStorage.getItem("tokenType")} ${localStorage.getItem("accessToken")}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error creating lecture: ${response.statusText}`);
    }

    const json = await response.json();
    return json.lectureId;
}
