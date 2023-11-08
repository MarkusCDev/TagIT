import React, { useState } from "react"
import { useUserAuth } from "./UserAuth"
import { useNavigate, Link } from "react-router-dom"
import ccnyimg from "../assets/ccnyhead.png"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signUp } = useUserAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email.includes("@citymail.cuny.edu")) {
      try {
        await signUp(email, password);
        navigate("/login")
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Email must include @citymail.cuny.edu")
    }
  }

  return (
    <div className="flex h-screen bg-violet-400">
      <div className="w-full max-w-xs m-auto bg-white rounded-lg p-5">
        {/* <a className="flex justify-center items-center mb-3 font-bold">SignUp</a> */}
        <img className="w-20 mx-auto mb-5" src={ccnyimg} />
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-indigo-500" for="username">Username</label>
            <input type="email"
                   placeholder="City College Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" name="username"/>
          </div>
          <div>
            <label className="block mb-2 text-indigo-500" for="password">Password</label>
            <input type="password"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)} 
                   className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300" name="password"/>
          </div>
          <div>          
            <button className="w-full bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 mb-6 rounded" type="submit">SignUp</button>
          </div>       
        </form>
        <a className="text-indigo-700 hover:text-purple-700 text-sm flex justify-center items-center"><Link to="/login">Already have an Account? Login</Link></a>
      </div>
    </div>
  )
}

export default Signup