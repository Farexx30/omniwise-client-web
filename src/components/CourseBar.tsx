import TransparentButton from "./TransparentButton"

const CourseBar = () => {
    const tabs = ["Lectures", "Assignments", "Members"];

    return (
        <div className="flex flex-col bg-black/20 rounded-2xl h-full w-72 op-0 bottom-0 left-0 p-5 overflow-y-auto">
            <span className="font-bold text-xl text-secondary-grey select-none whitespace-nowrap text-ellipsis pb-2 border-b border-secondary-grey border-2/20">
                CourseName
            </span>
            <div className="flex justify-between my-1">
                {tabs.map((tab) => (
                    <div>
                        <TransparentButton
                            text={tab}
                        />
                    </div>
                ))}
            </div>
            <div className="flex-grow overflow-auto">
                {Array.from({ length: 30 }).map((_, i) => (
                    <TransparentButton key={i} text={`Lecture ${i + 1}`} />
                ))}
            </div>
            <div className="flex flex-row w-full justify-between px-2 pt-2">
                <div>
                    <TransparentButton
                        text="Add"
                        textSize="text-sm"
                    />
                </div>
                <div>
                    <TransparentButton
                        text="Delete"
                        textSize="text-sm"
                    />
                </div>
            </div>
        </div>
    )
}

export default CourseBar