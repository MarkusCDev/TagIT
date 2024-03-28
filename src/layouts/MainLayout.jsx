import Logo from "../components/Logo";
import CopyrightNotice from "../components/CopyrightNotice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserAuth } from "../components/UserAuth";
import { twJoin } from "tailwind-merge";
import { Menu, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const MainNav = ({ isMenuOpen, setIsMenuOpen, user, logOut, navigate }) => {
  const handleLogOut = async () => {
    try {
      await logOut();
      console.log("You have Logged Off.");
      setIsMenuOpen(false);
      navigate("/");
    } catch (e) {
      console.log("Unable to Log Out.");
    }
  };

  return (
    <div className="bg-primary border-b-[1px] border-secondary/20 lg:border-none h-20 w-full">
      <div className="max-w-screen-xl px-4 mx-auto h-full flex items-center justify-between">
        <Logo />
        <ul className="hidden lg:flex gap-8 items-center no-underline font-urbanist font-semibold text-lg text-secondary h-full">
          <li className="w-fit h-full relative flex items-center overflow-hidden">
            <Link
              to="/map"
              className="peer hover:text-action transition-all duration-300"
            >
              Tracking
            </Link>
            <div className="absolute h-0.5 w-full rounded-full bottom-0 bg-action translate-y-2 peer-hover:translate-y-0 transition-all duration-300"></div>
          </li>
          <li className="w-fit h-full relative flex items-center overflow-hidden group">
            <Link
              to="/contact"
              className="peer hover:text-action transition-colors duration-300"
            >
              Contact
            </Link>
            <div className="absolute h-0.5 w-full rounded-full bottom-0 bg-action translate-y-2 peer-hover:translate-y-0 transition-all duration-300"></div>
          </li>
          <li
            className={twJoin(
              "w-fit h-full relative items-center overflow-hidden group",
              !user ? "flex" : "hidden"
            )}
          >
            <Link
              to="/login"
              className="peer hover:text-action transition-colors duration-300"
            >
              Log in
            </Link>
            <div className="absolute h-0.5 w-full rounded-full bottom-0 bg-action translate-y-2 peer-hover:translate-y-0 transition-all duration-300"></div>
          </li>
          <li className={twJoin(!user ? "flex" : "hidden")}>
            <button
              className="rounded-md bg-action/80 py-2 px-4 text-primary hover:bg-action transition-colors duration-300"
              onClick={() => navigate("/signup")}
            >
              Try it for free
            </button>
          </li>
          <li className={twJoin(!user ? "hidden" : "flex")}>
            <button
              className="rounded-md bg-action/10 py-2 px-4 text-secondary text-lg font-urbanist hover:bg-action/30 transition-colors focus:bg-action/40"
              onClick={() => handleLogOut()}
            >
              Log out
            </button>
          </li>
        </ul>
        <div
          className="flex lg:hidden text-action/80 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-7 h-7 hover:text-action transition-colors" />
          ) : (
            <Menu className="w-7 h-7 hover:text-action transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
};

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logOut } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await logOut();
      console.log("You have Logged Off.");
      navigate("/");
    } catch (e) {
      console.log("Unable to Log Out.");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 200);
  }, [location]);

  return (
    <div className="md:h-screen md:overflow-hidden">
      <MainNav
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        logOut={logOut}
        navigate={navigate}
        handleLogOut={handleLogOut}
      />
      {/* TO DO: Remove the md screen restriction when `/map page is fixed so that we can stay consistent with a one page no-scroll layout` */}
      <div className={twJoin("overflow-hidden relative", isMenuOpen ? "max-h-[calc(100vh-80px)]" : "md:max-h-[calc(100vh-80px)]")}>
        {/* We are subtracting by 144px because this is the result of adding the nav height (80px) and footer height (64px) to keep everything in one page */}
        <div className={twJoin(isMenuOpen ? "max-h-[calc(100vh-144px)]" : "md:max-h-[calc(100vh-144px)]")}>{children}</div>
        <CopyrightNotice />
        <div
          className={twJoin(
            "absolute inset-0 bg-primary z-[9999] transition-transform h-full",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <ul className="mt-4 flex flex-col gap-2 items-start w-11/12 h-full mx-auto no-underline font-urbanist text-2xl text-secondary font-bold">
            <li className="flex w-full justify-between items-center hover:translate-x-4 hover:text-action transition-transform">
              <Link to={"/map"}>Tracking</Link>
              <ChevronRight className="h-14 w-7" />
            </li>
            <li className="flex w-full justify-between items-center h-14 hover:translate-x-4 hover:text-action transition-transform">
              <Link to={"/contact"}>Contact</Link>
              <ChevronRight className="h-14 w-7" />
            </li>
            <li
              className={twJoin(
                "flex w-full justify-between items-center h-14 hover:translate-x-4 hover:text-action transition-transform",
                !user ? "flex" : "hidden"
              )}
            >
              <Link to={"/login"}>Log in</Link>
            </li>
            <li
              className={twJoin(
                "flex w-full items-center h-14 mt-auto mb-8",
                !user ? "flex" : "hidden"
              )}
            >
              <button
                className="w-full h-full rounded-md bg-action/80 hover:bg-action transition-colors flex justify-center items-center text-primary"
                onClick={() => navigate("/signup")}
              >
                Try it for free
              </button>
            </li>
            <li className={twJoin(!user ? "hidden" : "flex items-center h-14")}>
              <button
                className="bg-transparent text-secondary text-2xl font-urbanist hover:text-red-400 transition-colors h-fit"
                onClick={() => handleLogOut()}
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
