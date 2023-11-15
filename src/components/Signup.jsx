import React, { useState } from "react";
import { useUserAuth } from "./UserAuth";
import { useNavigate, Link } from "react-router-dom";
import ccnyimg from "../assets/ccnyhead.png";
import '../customStyles.css'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setconfirmPwd] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.includes("@citymail.cuny.edu") && password === confirmPwd) {
      try {
        await signUp(email, password);
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    } else {
      setPasswordsMatch(false);
      console.log("Email must include @citymail.cuny.edu");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="page-container">
      <div className="page-container-inner">
        {/* Logo */}
        <img className="w-20 h-20 mx-auto mb-5" src={ccnyimg} alt="CCNY Logo" />

        {/* SignUp Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
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

          <div>
            <label className="block mb-2 text-indigo-500" htmlFor="password">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confrim Password"
              value={confirmPwd}
              onChange={(e) => setconfirmPwd(e.target.value)}
              className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
              name="password"
            />
          </div>

          {!passwordsMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}

          {/* SignUp Button */}
          <button
            className="w-full bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 mb-6 rounded transition-colors duration-300"
            type="submit"
          >
            Sign up
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <a className="text-indigo-700 hover:text-purple-700 text-sm">
            <Link to="/login">Already have an Account? Login</Link>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
