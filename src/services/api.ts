import type { Course } from "../types/course";

const BASE_API_URL = import.meta.env.VITE_OMNIWISE_BASE_API_URL;


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