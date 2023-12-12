import React, { useState, useEffect } from "react"
import MapComponent from "../components/Map"
import Routing from "../components/Routing"
import '../customStyles.css'
import MapPublic from "../components/MapPublic"
import { doc, getDoc, collection, onSnapshot, query, limit, where, orderBy} from 'firebase/firestore';
import { db } from "../firebase"
import { useUserAuth } from "../components/UserAuth"

{/* Bus Route Table + Map Page */}

const LandingMap = () => {
  const { user } = useUserAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const currentUserEmail = user.email
  const [showMap, setShowMap] = useState(false)

  // Map and Routing Data to be sent as props for Map Public component
  const [shuttle1data, setShuttle1Data] = useState({})
  const [shuttle2data, setShuttle2Data] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Query for CCNY Shuttle 1
        const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("name", "==", "CCNY Shuttle 1"));
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            console.log("LM CCNY Shuttle 1: datetime", doc.data().datetime, " arrivaltime", doc.data().arrivaltime, " duration", doc.data().duration, " polyline", doc.data().ployline, " delta_duration", doc.data().duration_delta, " prevStop", doc.data().prevStop, " nextStop", doc.data().nextStop);
            await setShuttle1Data(doc.data())
          });
        });
  
        // Query for CCNY Shuttle 2
        const q2 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("name", "==", "CCNY Shuttle 2"));
        const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
           console.log("LM CCNY Shuttle 2: datetime", doc.data().datetime, " arrivaltime", doc.data().arrivaltime, " duration", doc.data().duration, " polyline", doc.data().ployline, " delta_duration", doc.data().duration_delta, " prevStop", doc.data().prevStop, " nextStop", doc.data().nextStop);
           await setShuttle2Data(doc.data())
          });
        });
  
        // Returning a cleanup function that unsubscribes from both queries
        return () => {
          unsubscribe1();
          unsubscribe2();
        };
      } catch (e) {
        console.log(e);
      }
    };
  
    fetchData();
  }, []);


  // Check if the user is admin to give access to google mapping
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
          <Routing shuttle1prop={shuttle1data} shuttle2prop={shuttle2data}/>
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
          {/* <MapComponent /> */}{/* <MapPublic /> */}
          {isAdmin && showMap ? <MapComponent/> : <MapPublic shuttle1prop={shuttle1data} shuttle2prop={shuttle2data}/>}
        </div>
      </div>
    </div>
  );
};

export default LandingMap
