import { Link } from "@tanstack/react-router";

interface TransparentLinkProps {
    to: string;
    params?: any;
    onClick?: () => void;
    iconSrc?: string;
    text: string;
    textSize?: string;
}

const TransparentButton = ({ to, params, onClick, iconSrc, text, textSize }: TransparentLinkProps) => {
    return (
        <Link 
            to={to} 
            params={{...params}}
            onClick={onClick}
            className="flex items-center bg-transparent w-full cursor-pointer select-none group">
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
        </Link>
    )   
}

export default TransparentButton