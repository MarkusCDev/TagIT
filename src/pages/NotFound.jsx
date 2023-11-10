import React from 'react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-violet-300 to-violet-500 items-center justify-center px-4 mt-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl m-auto bg-white rounded-lg p-5 shadow-lg">
        <div className="mb-8">
          <h1 className="text-center text-4xl text-indigo-700 font-bold">404 Not Found</h1>
        </div>
        <div className="text-center mb-6">
          <p className="text-xl text-black">Oops! The page you're looking for doesn't exist.</p>
        </div>
        <div className="text-center">
          <a href="/" className="text-indigo-700 hover:text-indigo-900 font-bold">Go Back Home</a>
        </div>
      </div>
    </div>
  )
}

export default NotFound;
