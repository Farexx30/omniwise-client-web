export function resetLocalStorage() {
    localStorage.removeItem("auth");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("courseInfo");
}

export function getObjFromJSONLocalStorage(key: string): any {
    const json = localStorage.getItem(key);

    if(!json) {
        return;
    }

    const obj = JSON.parse(json);
    return obj;
}