import { Link } from "@tanstack/react-router";

interface CourseCardProps {
    id: number;
    name: string;
    imgUrl?: string;
    onClick?: () => void;
}

const CourseCard = ({ id, name, imgUrl, onClick }: CourseCardProps) => {
    return (
        <div className="course-card hover:drop-shadow-[0_0_8px_rgba(140,71,246,1)] transition">
            <Link to="/home/courses/$courseId"
                params={{
                    courseId: id.toString()
                }}
                onClick={onClick}>
                <img src={imgUrl || '/course-basic-image.png'} alt={name} />
                <div className="absolute bottom-2 left-4 right-4 rounded-4xl w-auto bg-[#cecefb]/8 shadow-xl p-3 text-center ">
                    <h3>{name}</h3>
                </div>
            </Link>
        </div>
    )
}

export default CourseCard

