import logo from '/logo.svg';
import logoutIcon from '/logout.svg';
import TransparentButton from './TransparentButton';
import { Link, useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { resetLocalStorage } from '../utils/appHelpers';


const WebHeader = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        resetLocalStorage();

        // Clear all cached data and ongoing queries.
        await queryClient.cancelQueries();
        queryClient.clear();

        router.navigate({ to: "/login" })
    }

    return (
        <div className="bg-transparent w-full h-8 flex items-center select-none justify-between p-5">
            <Link to="/home">
                <div className="flex items-center text-white font-bold">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                    <span className="ml-2 font-light">Omniwise</span>
                </div>
            </Link>
            <div>
                <TransparentButton
                    iconSrc={logoutIcon}
                    text="Logout"
                    onClick={handleLogout}
                />
            </div>
        </div>
    )
}
export default WebHeader