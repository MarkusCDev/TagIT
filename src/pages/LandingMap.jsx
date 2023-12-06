import React, { useState, useEffect } from "react"
import MapComponent from "../components/Map"
import Routing from "../components/Routing"
import '../customStyles.css'
import Newest from "../components/Newest"
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase"
import { useUserAuth } from "../components/UserAuth"

{/* Bus Route Table + Map Page */}


const LandingMap = () => {
  const { user } = useUserAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const currentUserEmail = user.email
  const [showMap, setShowMap] = useState(false)

  const [busInfo, setBusInfo] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://us-central1-ccny-shuttle-a35ec.cloudfunctions.net/getBusTimings"); // URL of your deployed function
        const data = await response.json();
        setBusInfo(data)
      } catch (e) {
        console.log("error", e);
      }
    };


    fetchData();
    console.log("baki")
  }, []);

  useEffect(() => {
    const retdata = async () => {
      const docRef = doc(db, "admins", "admin_role")
      const docSnap = await getDoc(docRef)
      if (docSnap.data().emails.includes(currentUserEmail)) {
        setIsAdmin(true)
      } 
    }

    retdata();
  }, [user])

  const toggleComponent = () => {
    setShowMap(!showMap);
  };
  
  const handleToggleChange = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="landing-map-container">
      <div className="landing-map-container-inner">
        <div className="w-full mb-4">
          <Routing />
        </div>
       <div>
       {isAdmin && (
        <div className="flex justify-center my-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={showMap}
              onChange={handleToggleChange} 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">{showMap ? 'Google Map' : 'Public Map'}</span>
          </label>
        </div>
        )}
       </div>
        <div className="flex-grow w-full overflow-hidden rounded-lg">
          {/* <MapComponent /> */}
          {/* <Newest /> */}
          {isAdmin && showMap ? <MapComponent /> : <Newest />}
        </div>
      </div>
    </div>
  );
};

export default LandingMap
