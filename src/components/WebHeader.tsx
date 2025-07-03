import logo from '../assets/logo.svg';
import logoutIcon from '../assets/logout.svg';
import TransparentButton from './TransparentButton';


const WebHeader = () => {
    return (
        <div className="bg-transparent w-full h-10 flex items-center justify-between p-5">
            <div className="flex items-center text-white font-bold">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <span className="ml-2 font-light select-none">Omniwise</span>
            </div>
            <TransparentButton
                iconSrc={logoutIcon}
                text="Logout"
            />
        </div>
    )
}
export default WebHeader