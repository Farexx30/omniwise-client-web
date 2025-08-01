import TransparentButton from './TransparentButton';

interface FileProps {
    name: string;
    canDownload?: boolean;
    onClick: any;
    disabled?: boolean;
}

const FileView = ({ name, canDownload, onClick, disabled }: FileProps) => {
    return (
        <div className="bg-[#D9D9D9] text-black p-3 m-1 rounded-lg flex items-center gap-2 w-full overflow-hidden">
            <span className="flex-1 break-words break-all hyphens-auto">{name}</span>
            <div className="w-8 flex-shrink-0">
                <TransparentButton
                    iconSrc={canDownload ? "/download-icon.svg" : "/trash-icon.svg"}
                    disabled={disabled}
                    onClick={() => onClick(name)}
                />
            </div>
        </div>
    )
}

export default FileView