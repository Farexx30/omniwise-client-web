interface TransparentButtonProps {
    iconSrc: string;
    text: string;
}

const TransparentButton = ({ iconSrc, text }: TransparentButtonProps) => {
    return (
        <button className="flex items-center p-3 bg-transparent group">
            <img itemType="image/svg+xml" src={iconSrc} alt="" className="w-5 h-5 mr-2 group-hover:brightness-125 transition" />
            <span className="text-secondary-grey pb-0.5 group-hover:brightness-125 transition">{text}</span>
        </button>
    )   
}

export default TransparentButton