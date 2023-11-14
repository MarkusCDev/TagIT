import React, { useState } from "react";
import { useUserAuth } from "./UserAuth";
import { useNavigate, Link } from "react-router-dom";
import ccnyimg from "../assets/ccnyhead.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.includes("@citymail.cuny.edu")) {
      try {
        await logIn(email, password);
        navigate("/map");
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
    } else {
      setError("Use A @Citymail.cuny.edu");
      console.log("Email must include @citymail.cuny.edu");
    }
  };

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

          {/* Password Input */}
          <div>
            <label className="block mb-2 text-indigo-500" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
              name="password"
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 mb-6 rounded transition-colors duration-300"
            type="submit"
          >
            Login
          </button>
        </form>

        {/* Additional Links */}
        <div className="flex justify-between">
          <a
            className="text-indigo-700 hover:text-purple-700 text-sm"
            href="/forgot-password"
          >
            Forgot Password?
          </a>
          <a
            className="text-indigo-700 hover:text-purple-700 text-sm"
            href="/signup"
          >
            New? Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
