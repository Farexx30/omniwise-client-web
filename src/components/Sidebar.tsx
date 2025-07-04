import plusIcon from "../assets/plus.svg";
import signupIcon from "../assets/signup.svg";
import bell from "../assets/bell.svg";
import ShadowButton from "./ShadowButton";
import TransparentButton from "./TransparentButton";

const Sidebar = () => {
    return (
        <div className="flex flex-col bg-transparent h-full w-44 op-0 bottom-0 left-0 p-3">
            <ShadowButton
                iconSrc={plusIcon}
                text="New course"
            />
            <ShadowButton
                iconSrc={signupIcon}
                text="Join course"
            />
            <div className="p-2 w-full h-full overflow-hidden">
                <TransparentButton
                    iconSrc={bell}
                    text="Notifications"
                />
                <span className="text-secondary-grey font-semibold select-none mt-2 mb-2 text-left w-full block"> 
                    My courses 
                </span>
                {/* TODO: Add here list of courses using transparent button */}
            </div>
        </div>
    )
}

export default Sidebar

