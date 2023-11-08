import React from 'react'
import { useUserAuth } from '../components/UserAuth';
import { Link } from 'react-router-dom'
import logo from '../assets/frame.png'

const Landing = () => {
  
  return (
      <div className="flex flex-col h-screen bg-violet-400 justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8 text-center">
          {/* Logo Section */}
          <div className="mb-8">
            <img
              src={logo}
              alt="CCNY Shuttle Bus Tracker Logo"
              className="mx-auto h-40" 
            />
          </div>
  
          {/* Project Title */}
          <h1 className="text-3xl text-indigo-700 font-bold mb-4">CCNY Shuttle Bus Tracker</h1>
          <p className="text-indigo-700 font-semibold mb-6">Keeping you on the move, on time.</p>
  
          {/* Project Details */}
          <div className="mb-6">
            <h2 className="text-xl text-indigo-700 font-bold mb-4">About the Project</h2>
            <p className="text-indigo-700">
              The CCNY Shuttle Bus Tracker is a tracking project designed to make campus
              transportation easier and more accessible for CCNY students. Our platform provides
              up-to-date information on shuttle bus locations, routes, and estimated arrival times,
              helping you to plan your journey effectively and arrive on time, every time.
            </p>
          </div>
  
          {/* Features */}
          <div className="mb-6">
            <h2 className="text-xl text-indigo-700 font-bold mb-4">Features</h2>
            <ul className="text-indigo-700 list-disc pl-5 text-left mb-6">
              <li>Shuttle bus location tracking</li>
              <li>Detailed route maps</li>
              <li>Estimated arrival times at each stop</li>
              <li>User-friendly interface</li>
              <li>Service updates and notifications</li>
            </ul>
          </div>
  
          {/* Call to Action */}
          <Link to="/home">
          <button
            className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            type="button"
          >
            Start Tracking
          </button></Link>
        </div>
      </div>
  );
}

export default Landing