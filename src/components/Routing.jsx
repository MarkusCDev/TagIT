import React, { useEffect, useState } from "react"

const Routing = ({shuttle1prop, shuttle2prop}) => {
  const [to145th, setTo145th] = useState("--")
  const [to145thtonac, setTo145thToNac] = useState("--")
  const [to125th, setTo125th] = useState("--")
  const [to125thtonac, setTo125thToNac] = useState("--")
  
  // Function to find difference of arrival time (estiamted to nextStop) and current time for routing purposes
  function getTimeDifferenceInSeconds(arrivalTimeString) {
    const arrivalTime = new Date(arrivalTimeString);
    const currentTime = new Date();
    const differenceInMilliseconds = arrivalTime - currentTime;
    const differenceInSeconds = Math.ceil((differenceInMilliseconds / 1000) / 60)
    //console.log("difference", differenceInSeconds)
    if (differenceInSeconds < 0) {
      return "--"
    }

    return differenceInSeconds;
  }

  // Countdown route time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTo145th((prevTime) => (prevTime > 0 ? prevTime - 1 : "--"))
      setTo125th((prevTime) => (prevTime > 0 ? prevTime - 1 : "--"))
      setTo145thToNac((prevTime) => (prevTime > 0 ? prevTime - 1 : "--"))
      setTo125thToNac((prevTime) => (prevTime > 0 ? prevTime - 1 : "--"))
    }, 60000) // Decrements every 60 seconds

    // Cleanup
    return () => clearInterval(timer)
  }, [])


  // Checks for shuttle 1 routing updates
  useEffect(() => {
    if (shuttle1prop) { 
      const data = shuttle1prop
      console.log("data 2:", data)
      if (data.nextStop === "NAC" && data.prevStop === "W125") {
        setTo125thToNac(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
      if (data.nextStop === "NAC" && data.prevStop === "W145") {
        setTo145thToNac(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
      if (data.nextStop === "W145") {
        setTo145th(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
      if (data.nextStop === "W125") {
        setTo125th(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
    }
  }, [shuttle1prop]);


  // Checks for shuttle 2 routing updates
  useEffect(() => {
    if (shuttle2prop) { 
      const data = shuttle2prop
      console.log("data 2:", data)
      if (data.nextStop === "NAC" && data.prevStop === "W125") {
        setTo125thToNac(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
      if (data.nextStop === "NAC" && data.prevStop === "W145") {
        setTo145thToNac(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
      if (data.nextStop === "W145") {
        setTo145th(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
      if (data.nextStop === "W125") {
        setTo125th(getTimeDifferenceInSeconds(data.arrivaltime))
      } 
    }
  }, [shuttle2prop]);


  // Sets the times to show up on the map
  const stops = [
    { name: "To 145th", time: to145th },
    { name: "145th > CCNY", time: to145thtonac },
    { name: "To 125th", time: to125th },
    { name: "125th > CCNY", time: to125thtonac },
  ]

  // Chnage color of time depending on how close to 0
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
