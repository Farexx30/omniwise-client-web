import plusIcon from "../assets/plus.svg";
import signupIcon from "../assets/signup.svg";
import bell from "../assets/bell.svg";
import ShadowButton from "./ShadowButton";
import TransparentButton from "./TransparentButton";

const Sidebar = () => {
    return (
        <div className="flex flex-col bg-transparent h-full w-44 p-3">
            <div className="flex flex-col gap-2 mb-4">  
                <ShadowButton
                    iconSrc={plusIcon}
                    text="New course"
                />
                <ShadowButton
                    iconSrc={signupIcon}
                    text="Join course"
                />
                <TransparentButton
                    iconSrc={bell}
                    text="Notifications"
                />
                
                <span className="text-secondary-grey font-semibold select-none mt-2 text-left w-full block">
                    My courses
                </span>
            </div>
            <div className="flex-1 pr-1 overflow-y-auto">
                
                {Array.from({ length: 20 }).map((_, i) => (
                    <TransparentButton key={i} text={`Course ${i + 1}`} />
                ))}

                {/* TODO: Add here list of courses using transparent button */}
            </div>
        </div>
    )
}

export default Sidebar

