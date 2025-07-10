import React, { useRef, useState, type ChangeEvent } from "react";
import FileView from "./FileView";

interface FileInputProps {
    data: File[];
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemove: (name: string) => void;
    onClear: () => void;
    multiple?: boolean;
    accept?: string;
}

function FileInput({ data: files, onChange, onRemove, onClear, multiple, accept }: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex w-full justify-center items-center">
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex cursor-pointer justify-between min-w-40 bg-[#D9D9D9] text-white px-5 py-3 rounded-2xl hover:bg-[#D9D9D9]/90 w-fit"
                >
                    <span className="text-black font-medium">
                        {multiple ? "Add Files" : "Add File"}
                    </span>
                    <img
                        src="/folder-icon.svg"
                        alt=""
                        className="w-5 h-5 mt-[2px]"
                    />
                </button>
            </div>
            <div className="max-h-72 w-full overflow-y-auto overflow-x-clip">
                <ul className={`grid grid-cols-1 gap-5 p-4 w-full px-4 ${multiple ? `md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3` : ""}`}>
                    {files.map((f) => (
                        <li key={f.name}>
                            <FileView
                                name={f.name}
                                canDownload={false}
                                onClick={onRemove}
                            />
                        </li>
                    ))}
                </ul>
                {(files.length > 0 && multiple) && (
                    <div className="flex w-full justify-center items-center py-4">
                        <button
                            type="button"
                            onClick={onClear}
                            className="bg-[#D9D9D9] cursor-pointer text-black font-medium px-4 py-2 rounded-2xl hover:bg-[#D9D9D9]/90 w-fit"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                onChange={onChange}
                multiple={multiple}
                accept={accept}
                className="hidden"
            />
        </div>
    );
}

export default FileInput
