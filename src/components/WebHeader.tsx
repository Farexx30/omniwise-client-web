import logo from '/logo.svg';
import logoutIcon from '/logout.svg';
import TransparentLink from './TransparentLink';


const WebHeader = () => {
    return (
        <div className="bg-transparent w-full h-8 flex items-center select-none justify-between p-5">
            <div className="flex items-center text-white font-bold">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <span className="ml-2 font-light">Omniwise</span>
            </div>
            <div>
                <TransparentLink
                    to="/login"
                    iconSrc={logoutIcon}
                    text="Logout"
                />
            </div>
        </div>
    )
}
export default WebHeader