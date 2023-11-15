import React, { useState, useEffecct } from "react";
import MapComponent from "../components/Map";
import Routing from "../components/Routing";
import '../customStyles.css'

const LandingMap = () => {
  return (
    <div className="landing-map-container">
      <div className="landing-map-container-inner">
        <div className="w-full mb-4">
          <Routing />
        </div>
        <div className="flex-grow w-full overflow-hidden rounded-lg">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default LandingMap;
