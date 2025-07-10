import type { FileInfo } from '../types/file';
import { downloadAllFiles, downloadFile } from '../utils/file';
import FileView from './FileView';

interface ReadonlyFileList {
    data: FileInfo[];
    zipNameForDownloadAll: string;
    accept?: string;
}

const ReadonlyFileList = ({ data: files, zipNameForDownloadAll }: ReadonlyFileList) => {
    return (
        <div className="w-full max-h-72 overflow-y-auto overflow-x-clip">
            <ul className="grid grid-cols-1 gap-3 gap-x-5 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 p-4">
                {files.map(f => (
                    <li key={f.name}>
                        <FileView
                            name={f.name}
                            canDownload={true}
                            onClick={() => downloadFile(f.name, f.url)}
                        />
                    </li>
                ))}
            </ul>
            <div className="flex w-full justify-center items-center py-4">
                <button
                    type="button"
                    onClick={() => downloadAllFiles(files, zipNameForDownloadAll)}
                    className="bg-[#D9D9D9] cursor-pointer text-black font-medium px-4 py-2 rounded-2xl hover:bg-[#D9D9D9]/90 w-fit"
                >
                    Download All
                </button>
            </div>
        </div>
    )
}

export default ReadonlyFileList