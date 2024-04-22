import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import LandingHero from "../../public/busWithCircle.png";
import "../customStyles.css";

{
  /* About Us Page */
}

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full items-center justify-center overflow-hidden bg-primary">
      <div className="flex flex-col justify-start items-center w-11/12 mx-auto max-w-screen-xl h-[90%] my-auto gap-12">
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-2 font-redHatDisplay font-bold lg:text-center">
            <div className="flex gap-2 items-center text-action w-full justify-start lg:justify-center">
              <Clock className="w-9 h-9 xl:w-14 xl:h-14" />
              <p className="text-3xl md:text-4xl xl:text-6xl">On Time, Every Time</p>
            </div>
            <p className="text-3xl md:text-4xl xl:text-6xl text-secondary">
              Your Direct Line to CCNY Shuttles.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 font-redHatDisplay text-primary bg-action/80 hover:bg-action transition-colors h-14 rounded-md w-full lg:w-4/12 min-w-[340px]" onClick={() => navigate('/map')}>
            <p className="font-bold">START TRACKING</p>
            <ChevronRight className="h-8 w-4" />
          </button>
        </div>
        <div className="relative max-h-[40%] lg:max-h-none w-[350px] h-[310px] xl:w-[450px] xl:h-[380px]">
          <img src={LandingHero} className="object-contain h-full w-full" alt="image of a bus" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
