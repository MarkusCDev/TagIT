import React from 'react'

const Contact = () => {
  return (
    <div className="flex h-screen bg-violet-400">
  <div className="w-full max-w-md m-auto bg-white rounded-lg p-5">
    <div className="mb-4">
      <h1 className="text-center text-2xl text-indigo-700 font-bold">Contact Us</h1>
    </div>
    {/* Example Team Member */}
    <div className="mb-6">
      <h2 className="text-xl text-indigo-700">John Doe</h2>
      <p className="text-indigo-700">Position: Team Leader</p>
      <p className="text-indigo-700">Phone: (123) 456-7890</p>
      <p className="text-indigo-700">Email: johndoe@example.com</p>
    </div>
    {/* Another Team Member */}
    <div className="mb-6">
      <h2 className="text-xl text-indigo-700">Jane Smith</h2>
      <p className="text-indigo-700">Position: Developer</p>
      <p className="text-indigo-700">Phone: (098) 765-4321</p>
      <p className="text-indigo-700">Email: janesmith@example.com</p>
    </div>
    {/* Add more team members as needed */}
  </div>
</div>

  )
}

export default Contact