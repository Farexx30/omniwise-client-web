export function downloadFile(fileName: string, url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener noreferrer"
    a.click();
}