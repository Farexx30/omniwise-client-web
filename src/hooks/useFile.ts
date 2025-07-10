import { useCallback, useState } from "react";

export function useFile({ multiple = false }: { multiple?: boolean }) {
    const [files, setFiles] = useState<File[]>([]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) {
                return;
            }

            const newFiles = Array.from(e.target.files);

            setFiles(currentFiles => {
                if (multiple) {
                    const newFilesSet = new Set(newFiles.map(f => f.name));
                    const merged = [...newFiles];
                    currentFiles.forEach(f => {
                        if (!newFilesSet.has(f.name)) {
                            merged.push(f);
                        }
                    });
                    return merged;
                } 
                else {
                    return newFiles;
                }
            });

            e.target.value = "";
        }, [multiple]);

    const removeFile = (name: string) => {
        setFiles(prev => prev.filter(f => f.name !== name));
    };

    const clearFiles = () => setFiles([]);

    return {
        files,
        setFiles,
        onChange,
        removeFile,
        clearFiles,
    };
}