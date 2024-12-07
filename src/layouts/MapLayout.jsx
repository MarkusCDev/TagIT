import { useState } from "react";
import { LoaderCircle, LogOut, LayoutDashboard, MapPin, Menu, MessageSquareText, X } from "lucide-react";
import { twJoin } from "tailwind-merge";
import { useUserAuth } from "../components/UserAuth";
import Logo from "../components/Logo";
import { useLocation, useNavigate } from "react-router-dom";

const MapNav = ({ setOpenNav }) => {
  return (
    <div className="hidden lg:flex h-full w-20 bg-primary border-r-2 border-secondary/20 shadow-xl">
      <div className="w-full h-full flex flex-col items-center mt-6 gap-10 font-urbanist">
        <Menu
          className="w-6 h-6 text-action cursor-pointer"
          onClick={() => setOpenNav(true)}
        />
      </div>
    </div>
  );
};

const ExtendedMapNav = ({ openNav, setOpenNav, navigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { logOut } = useUserAuth();

  const handleLogOut = async () => {
    try {
      setIsLoading(true);
      await logOut().finally(() => {
        setIsLoading(false)
        navigate("/");
      });      
    } catch (e) {
      console.log("Unable to Log Out.");
    }
  };

  const handleAdminMapToggle = async () => {
    location.pathname === '/map' ? 
    (navigate('/admin'), setOpenNav(false)) : 
    (navigate('/map'), setOpenNav(false));
  }
  
  return (
    <div
      className={twJoin(
        "absolute left-0 w-11/12 lg:w-52 h-full translate bg-primary z-[9999] border-r-2 border-secondary/20 shadow-xl transition-transform",
        openNav ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="w-11/12 lg:w-10/12 h-full flex flex-col gap-8 items-center mx-auto mt-4">
        <div className="w-full flex border-b-2 border-secondary/20">
          <div className="w-full flex justify-between items-center text-action mb-4">
            <Logo />
            <X
              className="w-6 h-6 cursor-pointer"
              onClick={() => setOpenNav(false)}
            />
          </div>
        </div>
        <div className="flex gap-2 items-center text-action/80 hover:text-action cursor-pointer w-full" onClick={() => navigate("/contact")}>
          <MessageSquareText className="w-6 h-6" />
          <p className="text-base font-semibold">Contact</p>
        </div>
        {location.pathname === '/map' ?  
          <div className="flex gap-2 items-center text-action/80 hover:text-action cursor-pointer w-full" onClick={() => handleAdminMapToggle()}>
            <LayoutDashboard className="w-6 h-6" />
            <p className="text-base font-semibold">Admin Dashboard</p>
          </div> :
          <div className="flex gap-2 items-center text-action/80 hover:text-action cursor-pointer w-full" onClick={() => handleAdminMapToggle()}>
            <MapPin className="w-6 h-6" />
            <p className="text-base font-semibold">Map</p>
          </div>
        }
        <div className="flex gap-2 items-center text-action/80 hover:text-action cursor-pointer w-full" onClick={() => handleLogOut()}>
          <LogOut className="w-6 h-6" />
          <p className="text-base font-semibold">Sign out</p>
          <LoaderCircle className={twJoin("w-6 h-6 animate-spin", isLoading ? "flex" : "hidden")} />
        </div>
      </div>
    </div>
  );
};

const MapLayout = ({ children }) => {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full h-full left-0 top-0 absolute overflow-hidden">
      <div className="overflow-hidden absolute bottom-0 w-full h-full top-0 z-0 flex flex-col lg:flex-row">
        <MapNav setOpenNav={setOpenNav} />
        <div className="h-full w-full lg:w-[calc(100%-5rem)]">{children}</div>
        <ExtendedMapNav openNav={openNav} setOpenNav={setOpenNav} navigate={navigate}  />
        <div className="absolute top-5 left-5 w-14 h-14 rounded-full bg-primary z-[999] border-2 border-secondary/20 lg:hidden">
            <div className="w-full h-full flex justify-center items-center cursor-pointer" onClick={() => setOpenNav(true)}>
                <Menu className="w-6 h-6 text-action" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MapLayout;