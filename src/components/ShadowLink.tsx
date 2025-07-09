import { Link } from "@tanstack/react-router";

interface ShadowLinkProps {
    to: string;
    iconSrc?: string;
    text: string;
}

const ShadowLink = ({ to, iconSrc, text }: ShadowLinkProps) => {
    return (
        <Link
            to={to}
            className="w-full flex rounded-3xl items-center justify-center select-none p-2 cursor-pointer bg-primary hover:drop-shadow-[0_0_8px_rgba(140,71,246,1)] transition mb-3">
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
        </Link>
    )
}

export default ShadowLink