import React, {useState, useEffecct} from "react";
import { db } from "../firebase";
import { getDocs, collection, query, orderBy, limit} from "firebase/firestore";
import MapComponent from "../components/Map";
import Routing from "../components/Routing";

const Home = () => {

  const [docu, setDocu] = useState(null)
  const [long, setLong] = useState(1)
  const [latt, setLatt] = useState(2)

     const retData = async () => {
      const q = query(collection(db, "CCNY_Shuttle_1"), orderBy("datetime", "desc"), limit(1))
      const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
     console.log(doc.id, " => ", doc.data());
     });

    }

  return (
    <div class="flex flex-col justify-center rounded-lg items-center h-screen bg-violet-400">
      <div class="flex flex-col justify-center items-center bg-violet-300 rounded p-4">
        <div class="w-full mb-1">
          <Routing />
        </div>
        <div class="flex-grow overflow-hidden">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default Home;
