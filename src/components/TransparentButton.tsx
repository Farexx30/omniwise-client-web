interface TransparentButtonProps {
    iconSrc?: string;
    text: string;
    textSize?: string;
}

const TransparentButton = ({ iconSrc, text, textSize }: TransparentButtonProps) => {
    return (
        <button className="flex items-center bg-transparent w-full cursor-pointer select-none group">
            {iconSrc && (
                <img
                    itemType="image/svg+xml"
                    src={iconSrc}
                    alt=""
                    className="w-5 h-5 mr-2 group-hover:brightness-125 transition"
                />
            )}
            <span className={`text-secondary-grey pb-0.5 group-hover:brightness-125 transition overflow-hidden whitespace-nowrap text-ellipsis ${textSize}`}>
                {text}
            </span>
        </button>
    )   
}

export default TransparentButton