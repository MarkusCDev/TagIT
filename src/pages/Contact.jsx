import React from "react";
import { useUserAuth } from "../components/UserAuth";
import { Link } from "react-router-dom";
import '../customStyles.css'

const Contact = () => {
  const { user } = useUserAuth();

  return (
    <div className="page-container">
      <div className="page-container-inner">
        <div className="mb-8">
          <h1 className="text-center text-2xl text-indigo-700 font-bold">
            Contact Us
          </h1>
        </div>
        {/* Contact Info */}
        <div className="mb-6">
          <h2 className="text-xl text-black font-bold">Visit Us</h2>
          <p className="text-indigo-700">Compton-Goethals Building</p>
          <p className="text-indigo-700">Room CG04</p>
          <br />
          <p className="text-indigo-700">160 Convent Avenue</p>
          <p className="text-indigo-700">New York, NY 10031</p>
          <p className="text-indigo-700">Phone: (212) 650-8675</p>
          <p className="text-indigo-700">Email: facilities@ccny.cuny.edu</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl text-black font-bold">Contact Us</h2>
          <p className="text-indigo-700">Phone: (212) 650-8675</p>
          <p className="text-indigo-700">Email: facilities@ccny.cuny.edu</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl text-black font-bold">Visit our website</h2>
          <a
            href="https://www.ccny.cuny.edu/facilities"
            target="_blank"
            className="text-indigo-700"
          >
            Facilities website
          </a>
        </div>
        {/* Team Members */}
        <div className="mb-6">
          <h2 className="text-xl text-black font-bold">Team members</h2>
          <p className="text-indigo-700">Mengwai Chan</p>
          <p className="text-indigo-700">Markus Chmiel</p>
          <p className="text-indigo-700">Myat Thu Ko</p>
          <p className="text-indigo-700">Kevin Perchersky</p>
        </div>
        <div className="flex items-center justify-center">
            <Link to="/about">
              <button
                className="button-hover"
                type="button"
              >
                About Us
              </button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
