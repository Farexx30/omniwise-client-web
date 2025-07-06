interface CourseCardProps {
    id: number;
    name: string;
    imgUrl?: string;
}

const CourseCard = ({ id, name, imgUrl }: CourseCardProps) => {
    return (
        <div>
            <img src={imgUrl || '/search-icon.svg'} alt={name} />
            <div className="absolute bottom-10 left-4 right-4 rounded-4xl w-auto bg-white/40 p-3 text-center">
                <h3>{name}</h3>
            </div>
        </div>
    )
}

export default CourseCard

