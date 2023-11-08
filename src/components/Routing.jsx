import React from "react";

const Routing = () => {
  const stops = [
    { name: "To 145th", time: 10 },
    { name: "145th > CCNY", time: 15 },
    { name: "To 125th", time: 18 },
    { name: "125th > CCNY", time: 25 },
  ];

  const getColorForTime = (minutes) => {
    if (minutes <= 10) {
      return "text-green-600";
    } else if (minutes <= 20) {
      return "text-yellow-600";
    } else {
      return "text-red-600";
    }
  };

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
  );
};

export default Routing;
