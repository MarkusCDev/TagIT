import React, { useEffect, useState } from "react"

import CCNY from '../assets/CCNY-Logo-Only.png'
import Logo125th from '../assets/125thStationMarker.png'
import Logo145th from '../assets/145thStationMarker.png'
import { twJoin } from "tailwind-merge"

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
      console.log("data 1:", data)
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
    { name: <div className="flex gap-2 items-center">
      <img src={Logo145th} width={30} height={30} />
      <p className="text-lg font-redHatDisplay text-secondary font-medium">To 145th</p>
    </div>, time: to145th },
    { name: 
    <div className="flex gap-2 items-center">
      <img src={Logo145th} width={30} height={30} />
      <p className="text-lg font-redHatDisplay text-secondary font-medium">145th to CCNY</p>
      <img src={CCNY} width={30} height={30} />
    </div>, time: to145thtonac },
    { name: <div className="flex gap-2 items-center">
    <img src={Logo125th} width={30} height={30} />
    <p className="text-lg font-redHatDisplay text-secondary font-semibold">To 125th</p>
  </div>, time: to125th },
    { name: <div className="flex gap-2 items-center">
    <img src={Logo125th} width={30} height={30} />
    <p className="text-lg font-redHatDisplay text-secondary font-medium">125th to CCNY</p>
    <img src={CCNY} width={30} height={30} />
  </div>, time: to125thtonac },
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
    <div className="flex flex-col rounded-t-xl lg:rounded-lg shadow-lg h-full w-full">
      <div className="m-4 w-[calc(100% - 1rem)] h-[calc(100% - 1rem)] flex flex-col gap-4">
        <h1 className="flex justify-center text-2xl font-bold font-redHatDisplay">Shuttle Information</h1>
        <ul>
          {stops.map((stop, index) => {
            const active = stop.time === "--" ? false : true;
            return  (
              <li
                key={index}
                className={twJoin("flex justify-between items-center border-b py-2 last:border-0", active === false ? "opacity-50" : "")}
              >
                <span className="text-lg">{stop.name}</span>
                <span className={`font-semibold ${getColorForTime(stop.time)}`}>
                  {active === false ? stop.time : stop.time + "minutes away"}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Routing
