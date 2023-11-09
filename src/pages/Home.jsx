import React, {useState, useEffecct} from "react"
import MapComponent from "../components/Map"
import Routing from "../components/Routing";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-300 to-violet-500 justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="mt-3 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-gradient-to-b from-violet-300 to-violet-500 rounded-lg p-4 shadow-md">
        <div className="w-full mb-4">
          <Routing />
        </div>
        <div className="flex-grow w-full overflow-hidden rounded-lg">
          <MapComponent />
        </div>
      </div>
    </div>
  )  
}

export default Home
