import React, { useEffect, useState } from "react"
import { collection, query, orderBy, limit, onSnapshot, where, and } from "firebase/firestore"
import { db } from "../firebase"

const Routing = () => {
  const [to145th, setTo145th] = useState(30)
  const [to145thtonac, setTo145thToNac] = useState(30)
  const [to125th, setTo125th] = useState(30)
  const [to125thtonac, setTo125thToNac] = useState(30)

  // function secondsToCeilingMinutes(s) {
  //   var seconds = parseInt(s.slice(0, -1), 10)
  //   var minutes = Math.ceil(seconds / 60)
  //   return minutes;
  // }

  // function calculateRemainingTime(durationString, serverDateTime) {
  //   const currentTime = new Date();
  //   const endTime = new Date(serverDateTime);
  //   endTime.setSeconds(endTime.getSeconds() + parseInt(durationString.slice(0, -1), 10));
  
  //   const differenceInSeconds = (endTime - currentTime) / 1000;
  //   const remainingMinutes = Math.ceil(differenceInSeconds / 60);
  
  //   return remainingMinutes > 0 ? remainingMinutes : 0; // Ensure we don't go negative
  // }
  
  function getTimeDifferenceInSeconds(arrivalTimeString) {
    const arrivalTime = new Date(arrivalTimeString);
    const currentTime = new Date();
    const differenceInMilliseconds = arrivalTime - currentTime;
    const differenceInSeconds = Math.ceil((differenceInMilliseconds / 1000) / 60)
    console.log("Difference", differenceInSeconds)
    return differenceInSeconds;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTo145th((prevTime) => (prevTime > 0 ? prevTime - 1 : 15))
      setTo125th((prevTime) => (prevTime > 0 ? prevTime - 1 : 20))
      setTo145thToNac((prevTime) => (prevTime > 0 ? prevTime - 1 : 25))
      setTo125thToNac((prevTime) => (prevTime > 0 ? prevTime - 1 : 35))
    }, 60000) // Decrements every 60 seconds

    // Cleanup
    return () => clearInterval(timer)
  }, [])

  // Uncomment for Cloud Functions Timings
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTo125th((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); // Reset to 0 if we've reached the end
  //   }, 60000); // Decrements every 60 seconds
  
  //   return () => clearInterval(timer);
  // }, []);

  //NAC to 125
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("nextStop", "==", "W125"))
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //console.log("1 datetime: ", doc.data().datetime, " previous stop: ", doc.data().prevStop, " nest stop: ", doc.data().nextStop, " prev to next stop time: ", doc.data().duration)
            //console.log(secondsToCeilingMinutes(doc.data().duration))
            //setTo125th(secondsToCeilingMinutes(doc.data().duration))
            setTo125th(getTimeDifferenceInSeconds(doc.data().arrivaltime))

          })
        })
      } catch (e) {
        console.log(e)
      }
    };
    fetchData()
  }, [])

  //////////////////////////////////////////////////////////////////
  // Uncomment for Cloud functions
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("https://us-central1-ccny-shuttle-a35ec.cloudfunctions.net/getBusTimings"); // URL of your deployed function
  //       const data = await response.json();

  //       // Assuming data is an array of your timings
  //         // Or however you've structured your response
  //         // const duration = data[0].duration
  //         // setTo125th(secondsToCeilingMinutes(duration));
  //       const durationString = data[0].duration;
  //       const serverDateTime = data[0].datetime;
  //       const remainingTime = calculateRemainingTime(durationString, serverDateTime);
  //       setTo125th(remainingTime);
          
  //     } catch (e) {
  //       console.log("error", e);
  //     }
  //   };


  //   fetchData();
  //   console.log("baki")
  // }, []);
  ///////////////////////////////////////////////////////////

  // NAC to 145
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("nextStop", "==", "W145"))
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //console.log("2 datetime: ", doc.data().datetime, " previous stop: ", doc.data().prevStop, " nest stop: ", doc.data().nextStop, " prev to next stop time: ", doc.data().duration)
            // console.log(secondsToCeilingMinutes(doc.data().duration));
            setTo145th(getTimeDifferenceInSeconds(doc.data().arrivaltime))
          })
        })
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [])


  // 145 to NAC
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), and(where("prevStop", "==", "W145"), where("nextStop", "==", "NAC")))
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //setTo145thToNac(secondsToCeilingMinutes(doc.data().duration))
            setTo145thToNac(getTimeDifferenceInSeconds(doc.data().arrivaltime))
          })
        })
      } catch (e) {
        console.log(e)
      }
    };
    
    fetchData()
  }, [])

  // 125 to NAC
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), and(where("prevStop", "==", "W125"), where("nextStop", "==", "NAC")))
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //setTo125thToNac(secondsToCeilingMinutes(doc.data().duration))
            setTo125thToNac(getTimeDifferenceInSeconds(doc.data().arrivaltime))

          })
        })
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [])


  const stops = [
    { name: "To 145th", time: to145th },
    { name: "145th > CCNY", time: to145thtonac },
    { name: "To 125th", time: to125th },
    { name: "125th > CCNY", time: to125thtonac },
  ]

  const getColorForTime = (minutes) => {
    if (minutes <= 10) {
      return "text-green-600"
    } else if (minutes <= 20) {
      return "text-yellow-600"
    } else {
      return "text-red-600"
    }
  }

  return (
    <div className="flex-col bg-white rounded-lg shadow-lg p-4">
      <h1 className="flex justify-center text-2xl font-bold mb-5">Bus Stop Timings</h1>
      <ul>
        {stops.map((stop, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b py-2 last:border-0"
          >
            <span className="text-lg">{stop.name}</span>
            <span className={`font-semibold ${getColorForTime(stop.time)}`}>
              {stop.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Routing
