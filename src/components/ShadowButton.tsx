interface ShadowButtonProps {
    iconSrc?: string;
    text: string;
    isSubmitType?: boolean;
    onClick?: any;
    disabled?: boolean
}

const ShadowButton = ({ iconSrc, text, isSubmitType, onClick, disabled }: ShadowButtonProps) => {
    return (
        <button
            className="w-full flex rounded-3xl items-center justify-center select-none p-2 cursor-pointer bg-primary hover:drop-shadow-[0_0_8px_rgba(140,71,246,1)] transition mb-3 disabled:bg-gray-500 disabled:cursor-default disabled:hover:drop-shadow-none"
            type={isSubmitType ? "submit" : "button"}
            onClick={onClick}
            disabled={disabled}
        >
            {iconSrc && (
                <img
                    src={iconSrc}
                    alt=""
                    className="w-5 h-5 mr-2"
                />
            )}
            <span className="text-white font-medium pb-0.5">
                {text}
            </span>
        </button>
    )
}

export default ShadowButton