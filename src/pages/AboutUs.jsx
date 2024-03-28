import React from "react"
import { Link } from "react-router-dom"
import { useUserAuth } from "../components/UserAuth"
import logo from "../assets/logocircle.png"
import '../customStyles.css'

{/* About Us Page */}

const AboutUs = () => {
  const { user } = useUserAuth();

  return (
    <div className="about-us-container min-h-[calc(100vh-144px)] h-full">
      <div className="about-us-container-inner mb-3">

        {/* Logo Section */}
        <div className="mb-8">
          <img src={logo} alt="CCNY Shuttle Bus Tracker Logo" className="mx-auto h-20 sm:h-32 md:h-40" />
        </div>

        {/* Project Title */}
        <h1 className="text-2xl sm:text-3xl text-indigo-700 font-bold mb-4">CCNY Shuttle Bus Tracker</h1>
        <p className="text-indigo-700 font-semibold mb-6">Keeping you on the move, on time.</p>

        {/* Project Details */}
        <div className="mb-6 text-left">
          <h2 className="text-lg sm:text-xl text-indigo-700 font-bold mb-4">About the Project</h2>
          <p className="text-indigo-700">
            The Tag!T CCNY Shuttle Bus Tracker is a tracking project designed to make
            campus transportation easier and more accessible for CCNY students.
            Our platform provides information on shuttle bus
            locations, routes, and estimated arrival times, helping you to plan
            your journey effectively and arrive on time, every time.
          </p>
        </div>

        {/* Features */}
        <div className="mb-6 text-left">
          <h2 className="text-lg sm:text-xl text-indigo-700 font-bold mb-4">
            Features
          </h2>
          <ul className="text-indigo-700 list-disc pl-5 mb-6">
            <li>Shuttle bus location tracking</li>
            <li>Detailed route maps</li>
            <li>Estimated arrival times at each stop</li>
            <li>User-friendly interface</li>
          </ul>
        </div>

        {/* Call to Action Tracking Button */}
        {/* TO DO: When user is not logged in, make the button state 'Login', when they are logged in, say tracking */}
        {user ? (
          <Link to="/map"> 
           {/* If User Logged In = True */}
            <button className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"type="button"> Start Tracking</button>
          </Link>
        ) : (
          <Link to="/login">
            {/* If User Logged In = False */}
            <button className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300" type="button">Start Tracking</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
