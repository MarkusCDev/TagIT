import React, { useState } from "react";
import { useUserAuth } from "./UserAuth";
import { useNavigate, Link } from "react-router-dom";
import ccnyimg from "../assets/ccnyhead.png";
import '../customStyles.css'

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
        navigate("/");
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
    <div className="page-container">
      <div className="page-container-inner">
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
          <Link
            className="text-indigo-700 hover:text-purple-700 text-sm"
            to="/reset"
          >
            Forgot Password?
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
};

export default Login;
