import React from "react";
import { Link } from "react-router-dom";
import "../customStyles.css";

{/* Contact Us Page */}

const Contact = () => {
  return (
    <div className="page-container">
      <div className="page-container-inner">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-center text-2xl text-indigo-700 font-bold">
            Contact Us
          </h1>
        </div>

        {/* Team Members */}
        <div className="mb-6">
          <h2 className="text-xl text-black font-bold">Team members</h2>
          <p className="text-indigo-700">Mengwai Chan</p>
          <p className="text-indigo-700">Markus Chmiel</p>
          <p className="text-indigo-700">Myat Thu Ko</p>
          <p className="text-indigo-700">Kevin Pechersky</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl text-black font-bold">Team Contact</h2>
          <p className="text-indigo-700">ccnyshuttle@outlook.com</p>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h2 className="text-xl text-black font-bold">
            Facility Department Contact
          </h2>
          <p className="text-indigo-700">Phone: (212) 650-8675</p>
          <p className="text-indigo-700">Email: facilities@ccny.cuny.edu</p>
          <p className="text-indigo-700">
            To learn more about Facility Department,{" "}
            <a
              href="https://www.ccny.cuny.edu/facilities"
              className="inline-flex items-center font-medium text-indigo-700 hover:underline"
            >
              visit the website
              <svg
                className="w-4 h-4 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </p>
        </div>

        <div className="flex items-center justify-center justify-between">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeReao8WevqZm-ey8ZCqqdjI124Gt0Zzj4YQcfhXcoR1MGtGg/viewform"
            target="_blank"
          >
            <button
              className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              type="button"
            >
              Feedback Form
            </button>
          </a>
          <Link to="/about">
            <button
              className="bg-indigo-700 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              type="button"
            >
              About
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Contact;
