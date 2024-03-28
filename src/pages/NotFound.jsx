import React from 'react'
import { Link } from 'react-router-dom'
import '../customStyles.css'

{/* 404 Not Found Routing Page */}

const NotFound = () => {
  return (
    <div className="page-container min-h-[calc(100vh-144px)] h-full">
      <div className="page-container-inner">
        <div className="mb-8">
          <h1 className="text-center text-4xl text-indigo-700 font-bold">404 Not Found</h1>
        </div>
        <div className="text-center mb-6">
          <p className="text-xl text-black">Oops! The page you're looking for doesn't exist.</p>
        </div>
        <div className="text-center">
          <Link to="/about" className="text-indigo-700 hover:text-indigo-900 font-bold">Go Back Home</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound;
