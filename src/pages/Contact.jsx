import React from 'react'

const Contact = () => {
  return (
    <div className="flex h-screen bg-violet-400">
  <div className="w-full max-w-md m-auto bg-white rounded-lg p-5">
    <div className="mb-4">
      <h1 className="text-center text-2xl text-indigo-700 font-bold">Contact Us</h1>
    </div>
    {/* Contact Info */}
    <div className="mb-6">
      <h2 className="text-xl text-black">Facility Department</h2>
      <p className="text-indigo-700">Phone: (212) 650-8675</p>
      <p className="text-indigo-700">Email: facilities@ccny.cuny.edu</p>
    </div>
    {/* Team Members */}
    <div className="mb-6">
      <h2 className="text-xl text-black">Team</h2>
      <p className="text-indigo-700">Mengwai Chan</p>
      <p className="text-indigo-700">Markus Chmiel</p>
      <p className="text-indigo-700">Myat Thu Ko</p>
      <p className="text-indigo-700">Kevin Perchersky</p>

    </div>
  </div>
</div>

  )
}

export default Contact