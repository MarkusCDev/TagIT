import React, {useState} from 'react'
import logo from '../assets/ccnyhead.png'
import menu from '../assets/menu.png'
import { Link } from 'react-router-dom'
import { useUserAuth } from './UserAuth'

const Navbar = () => {
  const { user, logOut } = useUserAuth();

    const handleLogOut = async () => {
      try {
        await logOut()
        console.log("you are logged out")
      } catch (e) {
        console.log("suss not working")
      }
    }
  

  return (
    <nav class="border-gray-200 bg-gray-50">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" class="flex items-center">
            <img src={logo} class="h-10 mr-3" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap">Shuttle</span>
            </a>
            <button
            data-collapse-toggle="navbar-solid-bg"
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-solid-bg"
            aria-expanded="false"
            >
            <img src={menu} />
            </button>
            <div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
            <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
                {user ? (
                <>
                    <li><Link to="/home"><a class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Map</a></Link></li>
                    <li><Link to="/login"><a class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Contact</a></Link></li>
                    <li><a class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"><button onclick={handleLogOut}>Logout</button></a></li>
                </>
                ) : (
                <>
                    <li><Link to="/"><a class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Contact</a></Link></li>
                    <li><Link to="/login"><a class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Login</a></Link></li>
                </>
                )}
            </ul>
            </div>
        </div>
    </nav>
  )
}

export default Navbar