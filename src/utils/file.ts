import JSZip from "jszip";
import type { ReadonlyFile } from "../types/file";
import { saveAs } from "file-saver";

export async function downloadFile(fileName: string, url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(blobUrl);
}

export async function downloadAllFiles(files: ReadonlyFile[], zipName: string) {
    const zip = new JSZip();

    await Promise.all(
        files.map(async(f) => {
            const response = await fetch(f.url);
            const blob = await response.blob();
            zip.file(f.name, blob);
        })
    )

    const blobZip = await zip.generateAsync({type: "blob"});
    saveAs(blobZip, zipName);
}

