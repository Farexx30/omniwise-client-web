import { Link } from "@tanstack/react-router";
import TransparentButton from "./TransparentButton";
import enrollIcon from "/enroll.svg";

interface CourseCardProps {
    id: number;
    name: string;
    imgUrl?: string;
    onClick?: () => void;
    onEnroll?: (id: number) => void;
    disableControls?: boolean;
}

const CourseCard = ({ id, name, imgUrl, onClick, onEnroll, disableControls }: CourseCardProps) => {
    return (
        <div className="relative course-card hover:drop-shadow-[0_0_8px_rgba(140,71,246,1)] transition">
            {onEnroll ? (
                <>
                    <img src={imgUrl || '/course-basic-image.png'} alt={name} />
                    <div className="absolute top-4 right-4">
                        <TransparentButton
                            text="Join"
                            onClick={() => onEnroll(id)}
                            iconSrc={enrollIcon}
                            disabled={disableControls}
                        />
                    </div>
                    <div
                        className="absolute bottom-2 left-4 right-4 rounded-4xl w-auto bg-[#cecefb]/8 shadow-xl p-3 text-center"
                        title={name}
                    >
                        <h3 className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                            {name}
                        </h3>
                    </div>
                </>
            ) : (
                <Link to="/home/courses/$courseId"
                    params={{
                        courseId: id.toString()
                    }}
                    onClick={onClick}>
                    <img src={imgUrl || '/course-basic-image.png'} alt={name} />
                    <div
                        className="absolute bottom-2 left-4 right-4 rounded-4xl w-auto bg-[#cecefb]/8 shadow-xl p-3 text-center"
                        title={name}
                    >
                        <h3 className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                            {name}
                        </h3>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default CourseCard;
