import { Link } from "@tanstack/react-router";

interface TransparentLinkProps {
    to: string;
    params?: any;
    onClick?: () => void;
    iconSrc?: string;
    text: string;
    textSize?: string;
    disabled?: boolean;
}

const TransparentLink = ({ to, params, onClick, iconSrc, text, textSize, disabled }: TransparentLinkProps) => {
    return (
        <Link 
            to={to} 
            params={{...params}}
            onClick={onClick}
            disabled={disabled}
            className="flex items-center bg-transparent w-full cursor-pointer select-none group disabled:cursor-default">
            {iconSrc && (
                <img
                    itemType="image/svg+xml"
                    src={iconSrc}
                    alt=""
                    className={`w-5 h-5 mr-2 ${!disabled && "group-hover:brightness-125"} transition`}
                />
            )}
            <span className={`text-secondary-grey pb-0.5 ${!disabled && "group-hover:brightness-125"} transition overflow-hidden whitespace-nowrap text-ellipsis ${textSize}`}>
                {text}
            </span>
        </Link>
    )   
}

export default TransparentLink