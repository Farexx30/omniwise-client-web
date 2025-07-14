interface TransparentButtonProps {
    iconSrc?: string;
    text?: string;
    textSize?: string;
    onClick?: any; 
    isSubmitType?: boolean;
    disabled?: boolean;
    withEffect?: boolean;
    isAdminTab?: boolean;
}

const TransparentButton = ({ iconSrc, text, textSize, onClick, isSubmitType, disabled, withEffect, isAdminTab }: TransparentButtonProps) => {


    return (
        <button 
            type={isSubmitType ? "submit" : "button"}
            className={`flex items-center w-full ${isAdminTab ? "p-3" : "p-1"} cursor-pointer select-none group disabled:cursor-default ${withEffect ? (isAdminTab ? "bg-primary rounded-4xl" : "bg-primary rounded-2xl") : "bg-transparent"}`}
            onClick={onClick}
            disabled={disabled}
            >
            {iconSrc && (
                <img
                    itemType="image/svg+xml"
                    src={iconSrc}
                    alt=""
                    className="w-5 h-5 mr-2 group-hover:brightness-125 transition"
                />
            )}
            <span className={`${withEffect ? "text-white" : "text-secondary-grey"} pb-0.5 group-hover:brightness-125 transition overflow-hidden whitespace-nowrap text-ellipsis ${textSize}`}>
                {text}
            </span>
        </button>
    )   
}

export default TransparentButton