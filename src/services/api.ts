import type { Assignment, BasicAssignmentInfo } from "../types/assignment";
import type { Course } from "../types/course";
import type { NotificationDetails } from "../types/notification";
import type { BasicLectureInfo, Lecture } from "../types/lecture";
import type { AuthenticationSuccessResponse, BasicUserInfo, CourseMemberWithDetails, LoginResult, RegisterResult, RegisterUser, UserRole } from "../types/user";
import type { AssignmentSubmission } from "../types/assignmentSubmission";
import type { Auth, UserInfo } from "../types/localStorage";
import { getObjFromJSONLocalStorage } from "../utils/appHelpers";

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
    const authObj: Auth = { ...json }
    localStorage.setItem("auth", JSON.stringify(authObj))

    return "Success";
}

export const getBasicUserData = async (): Promise<LoginResult> => {
    const url = `${BASE_API_URL_DEV}/identity/my-basic-data`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        },
    });

    if (response.status === 401) {
        return "Unauthorized"
    }

    const json = await response.json();
    const userInfoObj: UserInfo = { ...json }
    localStorage.setItem("userInfo", JSON.stringify(userInfoObj))

    return "Success";
}


export const getEnrolledCourses = async (query?: string): Promise<Course[]> => {
    query = query?.trim() || "";
    const url = `${BASE_API_URL_DEV}/courses/enrolled?searchPhrase=${encodeURIComponent(query)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    console.log(tokenType);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
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
    const url = `${BASE_API_URL_DEV}/courses/available?searchPhrase=${encodeURIComponent(query)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
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
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching notifications: ${response.statusText}`);
    }

    const json = await response.json();
    return json as NotificationDetails[];
}

export const deleteNotification = async (id: number) => {
    const url = `${BASE_API_URL_DEV}/notifications/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error while deleting notification: ${response.statusText}`);
    }
}

export const enrollInCourse = async (courseId: number): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(courseId)}/members`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error enrolling in course: ${response.statusText}`);
    }
}

export const getCourseById = async (id: number): Promise<Course> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching course: ${response.statusText}`);
    }

    const json = await response.json();
    return json as Course;
}

export const deleteCourse = async (id: number) => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error while deleting course: ${response.statusText}`);
    }
}

export const updateCourse = async (formData: FormData, courseId: number): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(courseId)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error updating course: ${response.statusText}`);
    }
}


export const getLecturesByCourseId = async (id: number): Promise<BasicLectureInfo[]> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(id)}/lectures`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
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
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
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
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
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
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
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
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching assignment: ${response.statusText}`);
    }

    const json = await response.json();
    const result: Assignment = {
        ...json,
        files: json.fileInfos,
        submissions: json.submissions
    }
    return result;
}

export const updateAssignment = async (formData: FormData, assignmentId: number): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/assignments/${encodeURIComponent(assignmentId)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error updating assignment: ${response.statusText}`);
    }
}

export const getCourseMemberById = async (courseId: number, memberId: string): Promise<CourseMemberWithDetails> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(courseId)}/members/${encodeURIComponent(memberId)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
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
    const url = `${BASE_API_URL_DEV}/lectures/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error while deleting lecture: ${response.statusText}`);
    }
}

export const createCourse = async (formData: FormData): Promise<number> => {
    const url = `${BASE_API_URL_DEV}/courses`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
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
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error updating lecture: ${response.statusText}`);
    }
}

export const createLecture = async (formData: FormData, courseId: number): Promise<number> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(courseId)}/lectures`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error creating lecture: ${response.statusText}`);
    }

    const json = await response.json();
    return json.lectureId;
}

export const createAssignment = async (formData: FormData, courseId: number): Promise<number> => {
    const url = `${BASE_API_URL_DEV}/courses/${encodeURIComponent(courseId)}/assignments`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error creating assignment: ${response.statusText}`);
    }

    const json = await response.json();
    return json.assignmentId;
}

export const deleteAssignment = async (id: number) => {
    const url = `${BASE_API_URL_DEV}/assignments/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error while deleting assignment: ${response.statusText}`);
    }
}

export const getAssignmentSubmissionById = async (id: number): Promise<AssignmentSubmission> => {
    const url = `${BASE_API_URL_DEV}/assignment-submissions/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching assignment submission: ${response.statusText}`);
    }

    const json = await response.json();
    const result: AssignmentSubmission = {
        ...json,
        files: json.fileInfos
    }
    return result;
}


export const createAssignmentSubmissionComment = async (id: number, content: string) => {
    const url = `${BASE_API_URL_DEV}/assignment-submissions/${encodeURIComponent(id)}/assignment-submission-comments`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`

        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error(`Error while creating a new comment: ${response.statusText}`);
    }
}

export const deleteAssignmentSubmission = async (id: number) => {
    const url = `${BASE_API_URL_DEV}/assignment-submissions/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error while deleting assignment submission: ${response.statusText}`);
    }
}

export const updateAssignmentSubmission = async (formData: FormData, assignmentSubmissionId: number): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/assignment-submissions/${encodeURIComponent(assignmentSubmissionId)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error updating assignment submission: ${response.statusText}`);
    }
}

export const updateAssignmentSubmissionGrade = async (assignmentSubmissionId: number, grade: Number | null): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/assignment-submissions/${encodeURIComponent(assignmentSubmissionId)}/grade`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: JSON.stringify({ grade })
    });

    if (!response.ok) {
        throw new Error(`Error updating assignment submission: ${response.statusText}`);
    }
}

export const createAssignmentSubmission = async (formData: FormData, assignmentId: number): Promise<number> => {
    const url = `${BASE_API_URL_DEV}/assignments/${encodeURIComponent(assignmentId)}/assignment-submissions`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Error creating assignment submission: ${response.statusText}`);
    }

    const json = await response.json();
    return json.assignmentSubmissionId;
}

export const updateAssignmentSubmissionComment = async (id: number, content: string): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/assignment-submission-comments/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        },
        body: JSON.stringify({ content })
    });

    if (!response.ok) {
        throw new Error(`Error updating assignment submission comment: ${response.statusText}`);
    }
}

export const deleteAssignmentSubmissionComment = async (id: number): Promise<void> => {
    const url = `${BASE_API_URL_DEV}/assignment-submission-comments/${encodeURIComponent(id)}`;
    const { tokenType, accessToken } = getObjFromJSONLocalStorage("auth") as Auth;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`
        },
    });

    if (!response.ok) {
        throw new Error(`Error deleting assignment submission comment: ${response.statusText}`);
    }
}