import React, {useState, useEffecct} from "react";
import MapComponent from "../components/Map";
import Routing from "../components/Routing";

const Home = () => {
  return (
    <div className="flex flex-col justify-center rounded-lg items-center h-screen bg-violet-400">
      <div className="flex flex-col justify-center items-center bg-violet-300 rounded p-4">
        <div className="w-full mb-1">
          <Routing />
        </div>
        <div className="flex-grow overflow-hidden">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default Home;
