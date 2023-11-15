import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import ccnyimg from "../assets/ccnyhead.png";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendPasswordResetEmail(auth, email).then(data => {
            alert("Password reset completed, check your email.");
            navigate("/login");
        }).catch(err => {
            alert(err);
        })
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-violet-300 to-violet-500 items-center justify-center px-4 mt-2 sm:px-6 lg:px-8">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl m-auto bg-white rounded-lg p-5">
            {/* Logo */}
            <img className="w-20 h-20 mx-auto mb-5" src={ccnyimg} alt="CCNY Logo" />
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              <div className="mb-3">{error}</div>
    
              {/* Email Input */}
              <div>
                <label className="block mb-2 text-indigo-500" htmlFor="username">
                  Username/Email
                </label>
                <input
                  type="email"
                  placeholder="City College Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
                  name="username"
                />
              </div>
    
    
              {/* Submit Button */}
              <button
                className="w-full bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 mb-6 rounded transition-colors duration-300"
                type="submit"
              >
                Send Reset Email
              </button>
            </form>
    
            {/* Additional Links */}
            <div className="flex justify-between">
              <Link
                className="text-indigo-700 hover:text-purple-700 text-sm"
                to="/login"
              >
                Login Here
              </Link>
              <Link
                className="text-indigo-700 hover:text-purple-700 text-sm"
                to="/signup"
              >
                New? Create an account
              </Link>
            </div>
          </div>
        </div>
      );
}

export default ResetPassword