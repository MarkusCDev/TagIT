import React, { useState } from "react"
import { useUserAuth } from "./UserAuth"
import { useNavigate, Link } from "react-router-dom"
import ccnyimg from "../assets/ccnyhead.png"
import '../customStyles.css'

{/* Login Page */} 

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { logIn } = useUserAuth()
  const navigate = useNavigate()

  {/* Handles Firebase login */} 
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email.includes("@citymail.cuny.edu") || email.includes("@ccny.cuny.edu")) {
      try {
        await logIn(email, password)
        navigate("/map")
      } catch (err) {
        setError(err.message)
        console.log(err)
      }
    } else {
      setError("Use A @Citymail.cuny.edu")
      console.log("Email must include @citymail.cuny.edu")
    }
  }

  return (
    <div className="page-container h-full">
      <div className="page-container-inner">
        {/* Sign in message */}
        <h2 className="text-3xl text-gray-600 text-center font-bold">Sign in to TagIT</h2>
        {/* <h2 style={{textAlign: 'center', fontWeight: '700', color: 'grey', fontSize: '30px'}}>Sign in to TagIT</h2> */}
        <h2 className="text-gray-500 text-center mt-2">
          Use your <span className="font-bold">CCNY credentials</span> to sign in
        </h2>
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          <div className="text-center text-red-500 mb-5">{error}</div>

          {/* Email Input */}
          <div>
            {/* <label className="block mb-2 text-indigo-500" htmlFor="username">
              Username/Email
            </label> */}
            <input
              type="email"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-6 text-indigo-700 border border-gray-600 rounded-md outline-none focus:bg-gray-300"
              name="username"
            />
          </div>

          {/* Password Input */}
          <div>
            {/* <label className="block mb-2 text-indigo-500" htmlFor="password">
              Password
            </label> */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-6 text-indigo-700 border border-gray-600 rounded-md outline-none focus:bg-gray-300"
                name="password"
              />
              <button
                type="button"
                className="flex items-center absolute top-0 right-0 mt-3 mr-4 p-0.25 rounded"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACaklEQVR4nO2YS0tVURTHf2CRkNpjkmaPWegogug7lIpGo4j6LEWYWlE0CZr0+AI26YGE6cRhRAQV2iBBSYKbllEidE9sWcL1cvY+e51z7tVg/WCBiP/12HuftdcWDMMwDMMwjP+B3U3SNIRWYAi4CfTm0PeK1vnYwzZwELgGfAe+AMcK+DoOzIuvq8ABmsB+YAT4CSTAGnCyBL+nxFcC/ACGJVZDuAQsSbBNcytYFm6Ha31/BS6W6H/j2LyqC+KsArQHdIPANPBLbAoYCPx9B7CcEmei4NHdYEjObpJi9wO6UY8mkWPj44FHU5GFUbMLuAtUAwn5VncwoNm0/hzaKnAHaIktYh/wMiKZox79dIT2daCDJRn2Qo5hkC7gfYSzRO6QNFYjtK7rpdEaGfsd0ElgNeYiHSWBD71IIe2K+LNpTaBLWYSzE55kpiK0kx5tjzKH2fqdmVE6SKSjpTEQoe3zaC/kyGOmaCEP8TMc0F0P6J4ULeQQ8EnpoCIdzke/dKdVscnATiAjybIyh4+S+xa6gc9KR6HLTcuYMvac5JyK++jfKpz9AU6XUMQZ8ZVE2pu0nainwzNb+WwBOFKgCHexLiriTWTMeFtokcn2b6TzRVnVPOP7fGSMKnAv76vyPLCiOGYjGQ2g9sMeq3mDZNlKoN1H427854qtd9PyIwnsLrg2sR5ZmMfK7vSsjDG+/qJbUHaWIrYEXKGBb/Xbyg6jtd/ArWa93bvlvx/aCyzrSI4Ch9kG2mT73ftlPUfy6/K+uAzsZYfgijoH3ACeAh+Ab9KZ1uRn97txmQjO7qTkDcMwDMMwDLz8A0oKJQWhP1MnAAAAAElFTkSuQmCC"
                      alt="Eye Icon"
                      className="h-6 w-6 text-indigo-500 mr-2"
                    />
                    <span className="text-indigo-500">Hide</span>
                  </>
                ) : (
                  <>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA1UlEQVR4nO3UP2oCQRTH8Y9FDpBsQq5gFSSXsRQ7ixwjdYpAIJ2NeoBcQCxtPISFShJIkRTRJmHhFcvinwFXsNgvPBjmzfx+b2YeQ01NlWQRJ9MZYXGkyV1oDLYlmxgeYdDGD+ahtZcHPOM6QfgGffxhgtuUanrYREWvaJXyDdzjCd9Y4xEXEsmPuMJXbM6r+8QUsxjnc7+xZpVyLUXxZTxWE1fo4gUfeI/r6+CysH6ZYpKVxMuMI8oUTfY2SRadtKuS8Q6DKrrwoEElvEWc/XdSUyOdf16GMBUdhzIFAAAAAElFTkSuQmCC"
                      alt="Eye Icon"
                      className="h-6 w-6 text-indigo-500 mr-2"
                    />
                    <span className="text-indigo-500">Show</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-action hover:bg-purple-700 text-white font-bold py-2 px-4 mb-5 rounded transition-colors duration-300"type="submit">Sign In</button>
        </form>

        {/* Additional Links */}
        <div className="flex justify-between">
          <Link className="text-indigo-700 hover:text-purple-700 text-sm" to="/reset">Forgot Password?</Link>
          <Link className="text-indigo-700 hover:text-purple-700 text-sm" to="/signup">New? Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
