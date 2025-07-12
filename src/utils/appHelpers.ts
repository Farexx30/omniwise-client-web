export function resetLocalStorage() {
    localStorage.removeItem("tokenType");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("currentCourseId");
    localStorage.removeItem("currentCourseName");
}