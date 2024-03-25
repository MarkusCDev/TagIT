import Logo from "../components/Logo";
import CopyrightNotice from "../components/CopyrightNotice";
import { Link, useNavigate } from "react-router-dom"
import { useUserAuth } from "../components/UserAuth";
import { twJoin } from "tailwind-merge";

const MainNav = () => {
    const navigate = useNavigate()
    const { user, logOut } = useUserAuth()

    const handleLogOut = async () => {
        try {
          await logOut();
          console.log("You have Logged Off.")
          setIsMenuOpen(false)
          navigate("about")
        } catch (e) {
          console.log("Unable to Log Out.")
        }
    };

    return (
        <div className="bg-primary border-b-[1px] border-secondary/20 lg:border-none h-20 w-full">
            <div className="max-w-screen-xl px-4 mx-auto h-full flex items-center justify-between">
                <Logo />
                <ul className="flex gap-8 items-center no-underline font-urbanist font-semibold text-lg text-secondary h-full">
                    <li className="w-fit h-full relative flex items-center overflow-hidden">
                        <Link to="/map" className="peer hover:text-action transition-all duration-300">Tracking</Link>
                        <div className="absolute h-0.5 w-full rounded-full bottom-0 bg-action translate-y-2 peer-hover:translate-y-0 transition-all duration-300"></div>
                    </li>
                    <li className="w-fit h-full relative flex items-center overflow-hidden group">
                        <Link to="/contact" className="peer hover:text-action transition-colors duration-300">Contact</Link>
                        <div className="absolute h-0.5 w-full rounded-full bottom-0 bg-action translate-y-2 peer-hover:translate-y-0 transition-all duration-300"></div>
                    </li>
                    <li className={twJoin("w-fit h-full relative items-center overflow-hidden group", !user ? 'flex' : 'hidden')}>
                        <Link to="/login" className="peer hover:text-action transition-colors duration-300">Log in</Link>
                        <div className="absolute h-0.5 w-full rounded-full bottom-0 bg-action translate-y-2 peer-hover:translate-y-0 transition-all duration-300"></div>
                    </li>
                    <li className={twJoin(!user ? 'flex' : 'hidden')}>
                        <button className="rounded-md bg-action/80 py-2 px-4 text-primary hover:bg-action transition-colors duration-300" onClick={() => navigate("/signup")}>Try it for free</button>
                    </li>
                    <li className={twJoin(!user ? 'hidden' : 'flex')}>
                        <button className="rounded-md bg-transparent py-2 px-4 text-secondary text-lg font-urbanist hover:bg-action/10 transition-colors" onClick={() => handleLogOut()}>Log out</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

const MainLayout = ({ children }) => {
    return (
        <div className="h-screen overflow-hidden">
        <MainNav />
        {/* We are subtracting by 144px because this is the result of adding the nav height (80px) and footer height (64px) to keep everything in one page */}
        <div className="max-h-[calc(100vh-144px)]">
            {children}
        </div>
        <CopyrightNotice />
        </div>
    )
};

export default MainLayout;