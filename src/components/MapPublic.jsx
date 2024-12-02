import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import shuttle1 from '../assets/topOfBus.png'
import shuttle2 from '../assets/shuttle2R.png'

import CCNY from '../assets/ccny.png'
import Logo125th from '../assets/trainStations.png'
import Logo145th from '../assets/trainStations.png'

const MAX_DATA_AGE = 5 * 60 * 1000; // 5 minutes
const NAC_CORD = [40.82001421347782, -73.94900569957996]
const W145_CORD = [40.823866173326145, -73.94489315828145] 
const W125_CORD = [40.810790169812186, -73.95259361484852]

const MapPublic = ( {shuttle1prop, shuttle2prop} ) => {
    const [shuttle1route, setShuttle1Route] = useState('')
    const [shuttle2route, setShuttle2Route] = useState('')
    const [shuttle1duration, setShuttle1Duration] = useState('')
    const [shuttle2duration, setShuttle2Duration] = useState('')
    const [shuttle1Position, setShuttle1Position] = useState(null)
    const [shuttle1PreviousPosition, setShuttle1PreviousPosition] = useState(null)
    const [shuttle2Position, setShuttle2Position] = useState(null)
    const [shutte1offset, setShuttle1Offset] = useState(0)
    const [shutte2offset, setShuttle2Offset] = useState(0)

    const desktopCenter = [40.81792206720871, -73.94995404366331];
    const mobileCenter = [40.81311458493628, -73.95070408860828];


    const [center, setCenter] = useState(() => {
      const mql = window.matchMedia("(max-width: 768px)");
      return mql.matches ? mobileCenter : desktopCenter;
    });

  useEffect(() => {
      const mql = window.matchMedia("(max-width: 768px)");
      const handleResize = (e) => {
          setCenter(e.matches ? mobileCenter : desktopCenter);
      };

      mql.addEventListener('change', handleResize);
      return () => mql.removeEventListener('change', handleResize);
  }, []);
    //////////////////////////// Hardcoded PolyLine //////////////////////////////////////

    // Used to ensure bus polyline updates once it reaaches a train stop (145/125)
    // despite no airtag updates it will show the bus going back to campus

    const To145Poly = "iqcxFbjjbMaIgFiLwH}ByAqCmBvBwGz@`@"
    const ToNacFrom145Poly = "kkdxFfkibMfNbFcDbKjJjGpCfB"
    const To125Poly =  "iqcxFbjjbMfEtC`@`@rA~CV\\lFlD`@PtL~@~CBpDJ~AbAJNlEpCZ_@pBgBr@sBYIg@["
    const ToNacFrom125Poly = "axaxFl|jbMiAs@sBnGeC_BUBeBeAyDGqCEwL_Am@[_FcDa@k@iAqCu@q@sDeC"

    //////////////////////////// Shuttle Bus Data /////////////////////////////////////////

    // Checks for updates of shuttle1data passed from landing map firebase query
    useEffect(() => {
      if (!shuttle1prop || !Array.isArray(shuttle1prop) || !shuttle1prop[0]) {
        return;
      }
      const recentPosition = shuttle1prop[0];
      if (!recentPosition.timestamp) {
        return;
      }
      const dataAge = new Date() - new Date(recentPosition.timestamp);
      if (dataAge > MAX_DATA_AGE) {
        return;
      }
      if (recentPosition.latitude && recentPosition.longitude) {
        setShuttle1Position([recentPosition.latitude, recentPosition.longitude]);
      }
      const previousPosition = shuttle1prop[1];
      if (previousPosition?.latitude && previousPosition?.longitude) {
        setShuttle1PreviousPosition([previousPosition.latitude, previousPosition.longitude]);
      }
    }, [shuttle1prop]);
  
    const [busRoute, setBusRoute] = useState(null);
  
    useEffect(() => {
      const updateBusRoute = () => {
        if (!shuttle1Position || !shuttle1Position[0] || !shuttle1Position[1]) return null;
        setBusRoute(createBusToStopPolyline(shuttle1Position, shuttle1PreviousPosition));
      }
   
      updateBusRoute();
    }, [shuttle1Position]); // Dependencies array

    // Checks for updates of shuttle2data passed from landing map firebase query
    useEffect (() => {
        if (shuttle2prop && shuttle2prop.polyline && shuttle2prop.duration_delta && shuttle2prop.datetime) {
          const decodedPoly2 = decodeAndFormatPolyline(shuttle2prop.polyline)
          setShuttle2Route(decodedPoly2)
          setShuttle2Duration(convertToSeconds(shuttle2prop.duration_delta))
          setShuttle2Offset(startHere(shuttle2prop.datetime, shuttle2prop.duration_delta))
        }

    }, [shuttle2prop])

    // TO DO: Move this to a utils file
    const calculateDistance = (point1, point2) => {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371e3; // Earth's radius in meters
    
      const lat1 = Array.isArray(point1) ? point1[0] : point1.lat;
      const lon1 = Array.isArray(point1) ? point1[1] : point1.lng;
      const lat2 = Array.isArray(point2) ? point2[0] : point2.lat;
      const lon2 = Array.isArray(point2) ? point2[1] : point2.lng;
    
      const φ1 = toRad(lat1);
      const φ2 = toRad(lat2);
      const Δφ = toRad(lat2 - lat1);
      const Δλ = toRad(lon2 - lon1);
    
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
      return R * c; // Returns distance in meters
    };    

    /////////////////////////////// Animation Handeling ///////////////////////////////////////

    // Calculates the number and location of marker lat/long between source and destination of bus for every second of duration
    const interpolatePoints = (points, numSteps) => {
        const totalSegments = points.length - 1;
        const stepsPerSegment = Math.ceil(numSteps / totalSegments);
        const interpolatedPoints = [];
    
        for (let i = 0; i < totalSegments; i++) {
            const start = points[i];
            const end = points[i + 1];
            for (let step = 0; step < stepsPerSegment; step++) {
                const ratio = step / stepsPerSegment;
                const interpolatedLat = start.lat + (end.lat - start.lat) * ratio;
                const interpolatedLng = start.lng + (end.lng - start.lng) * ratio;
                interpolatedPoints.push({ lat: interpolatedLat, lng: interpolatedLng });
                if (interpolatedPoints.length >= numSteps) break;
            }
            if (interpolatedPoints.length >= numSteps) break;
        }
        if (interpolatedPoints.length < numSteps) {
            interpolatedPoints.push(points[points.length - 1]); // Ensure the last point is added
        }
    
        //console.log(interpolatedPoints.length)
        return interpolatedPoints;
    };
    
    // Triggers the shuttle "animations" which is just an update of the marker for every second left till arrival time is reached
    // const animateShuttle = (route, setShuttlePosition, duration, startAt) => {
      
        
    //   const interpolatedRoute = interpolatePoints(route, duration);
    //     let step = startAt < interpolatedRoute.length ? startAt : 0;
    
    //     const intervalId = setInterval(() => {
    //         setShuttlePosition(interpolatedRoute[step]);
    //         step++;
    //         if (step >= interpolatedRoute.length) clearInterval(intervalId);
    //     }, 1000);
    // };

    // // Updates routing animation 
    // useEffect(() => {
    //     if (shuttle1route.length && shuttle1duration) {
    //         animateShuttle(shuttle1route, setShuttle1Position, shuttle1duration, shutte1offset);
    //     }
    // }, [shuttle1route, shuttle1duration, shutte1offset]);
    
    // useEffect(() => {
    //     if (shuttle2route.length && shuttle2duration) {
    //         animateShuttle(shuttle2route, setShuttle2Position, shuttle2duration, shutte2offset);
    //     }
    // }, [shuttle2route, shuttle2duration, shutte2offset]);
    
    const createShuttleMarker = (imageUrl, position, previousPosition) => {
        if (!position) return null;

        const icon = L.icon({
            iconUrl: imageUrl,
            iconSize: [38, 20],
            iconAnchor: [19  , 10],
            className: 'shuttle-marker'
        });

        // Calculate rotation angle based on movement direction
        let rotationAngle = 0;
        if (previousPosition) {
            const dx = position[1] - previousPosition[1];
            const dy = position[0] - previousPosition[0];
            rotationAngle = Math.atan2(dx, dy) * (180 / Math.PI);
        }

        return <Marker position={position} icon={icon} autoPan={false} zIndexOffset={1000} />;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////

    // Function to adjust time for map synchronizing across user devies due to client side computing (handles ios browser formatting)
    function startHere(initial_timestamp, delta_duration) {
        const currentTime = new Date();
        
        // Replace double spaces with a single space and add 'T' between date and time
        const formattedTimestamp = initial_timestamp.replace("  ", "T");
        const initialTime = new Date(formattedTimestamp);
    
        if (isNaN(initialTime)) {
            console.error("Invalid initial date:", formattedTimestamp);
            return 0; // Or handle the error as appropriate
        }
    
        const elapsedTime = Math.floor((currentTime - initialTime) / 1000);
        
        //console.log("int time:", initialTime)
        //console.log("elapsed time:", elapsedTime)
        if (elapsedTime > delta_duration) {return delta_duration - 1}
        if (elapsedTime < 0) {return 0}
        return elapsedTime
    }
    
    // Changes strings with s to an int in seconds
    function convertToSeconds(timeStr) { 
        let seconds = parseInt(timeStr)
        return seconds
      }

    // Convert encoded polyline for leaflet mapping
    function decodeAndFormatPolyline(encodedPolyline) {
        const decodedPath = polyline.decode(encodedPolyline);
        return decodedPath.map(point => ({ lat: point[0], lng: point[1] }));
      }
    
    const createBusToStopPolyline = (busPosition, previousPosition) => {
      // We should not make a polyline if we don't have the data
      if (!busPosition || !previousPosition) return null;

      let stopPosition;
      // TO DO: Calculate the distance between the two points and NAC, if the difference is positive then the bus is moving away from NAC and vice versa
      const distanceToNac = calculateDistance(busPosition, NAC_CORD) - calculateDistance(previousPosition, NAC_CORD)
      if (distanceToNac > 0) {
        // TO DO: If the bus is moving away from NAC, then calculate the distance between the two points and 145th and 125th, see if its getting closer to either
        const distanceTo145 = calculateDistance(busPosition, W145_CORD) - calculateDistance(previousPosition, W145_CORD)
        const distanceTo125 = calculateDistance(busPosition, W125_CORD) - calculateDistance(previousPosition, W125_CORD)
        // TO DO: If both are positive then the bus is moving towards both, so we should use the closest one
        if (distanceTo145 > 0 && distanceTo125 > 0) {
          stopPosition = distanceTo145 < distanceTo125 ? W145_CORD : W125_CORD
        } else if (distanceTo145 > 0) {
          stopPosition = W125_CORD
        } else if (distanceTo125 > 0) {
          stopPosition = W145_CORD
        } else {
          stopPosition = distanceTo145 < distanceTo125 ? W145_CORD : W125_CORD
        }
      } else {
        // TO DO: Its getting closer to NAC, so its the stop
        stopPosition = NAC_CORD
      }
      // Convert stopPosition to array format if it isn't already
      const stopPositionArray = Array.isArray(stopPosition) ? stopPosition : [stopPosition.lat, stopPosition.lng];
      const busPositionArray = Array.isArray(busPosition) ? busPosition : [busPosition.lat, busPosition.lng];

      let routePolyline;
      if (stopPositionArray[0] === W145_CORD[0] && stopPositionArray[1] === W145_CORD[1]) {
        routePolyline = To145Poly;
      } else if (stopPositionArray[0] === W125_CORD[0] && stopPositionArray[1] === W125_CORD[1]) {
        routePolyline = To125Poly;
      } else if (stopPositionArray[0] === NAC_CORD[0] && stopPositionArray[1] === NAC_CORD[1]) {
        const distanceTo145 = calculateDistance(busPosition, W145_CORD);
        const distanceTo125 = calculateDistance(busPosition, W125_CORD);
        routePolyline = distanceTo145 < distanceTo125 ? ToNacFrom145Poly : ToNacFrom125Poly;
      }

      const decodedRoute = polyline.decode(routePolyline);

      // Find the closest point on the route to the current bus position
      let closestPointIndex = 0;   
      let minDistance = Infinity;
    
      decodedRoute.forEach((point, index) => {
        const distance = calculateDistance(busPosition, point);
        if (distance < minDistance) {
          minDistance = distance;
          closestPointIndex = index;
        }
      });

      // Get the remaining route from the closest point
      const remainingRoute = decodedRoute.slice(closestPointIndex);

      // Always ensure the exact stop coordinates are the last point
      if (remainingRoute[remainingRoute.length - 1] !== stopPositionArray) {
        remainingRoute.push(stopPositionArray);
      }
      if (remainingRoute[0] !== busPositionArray) {
        remainingRoute.unshift(busPositionArray);
      }

      // TO DO: Each stop has a different color, have the polyline match the color of the stop
      return <Polyline 
        positions={remainingRoute}
        pathOptions={{ 
          color: '#000000',
          weight: 3,
          opacity: 1  
        }} 
      />;
    }

    // Leaflet mapping restrictions
    const zoom = 15;
    const shuttlePath = decodeAndFormatPolyline('iqcxFbjjbMfEtC`@`@rA~CV\\lFlD`@PtL~@~CBpDJ~AbAJNlEpCZ_@pBgBr@sBYIg@[iAs@qBjGgC{AUBeBeAyDGqCEwL_Am@[_FcDa@k@iAqCu@q@sDeCaIgFiLwH}ByAqCmBvBwGz@`@lNdFcDbKjJjGpCfB');

    // Create MTA marker
    const createMtaMarker = (imageUrl, lat, lng) => {
        const icon = L.icon({
          iconUrl: imageUrl,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
      
        return <Marker position={[lat, lng]} icon={icon} />;
      };

    // Create NAC marker
    const createNacMarker = (imageUrl, lat, lng) => {
        const icon = L.icon({
          iconUrl: imageUrl,
          iconSize: [20, 20],
          iconAnchor: [10, 10 ]
        });
      
        return <Marker position={[lat, lng]} icon={icon} />;
      };

    // Marker Data 
    const nacMarker = createNacMarker(CCNY, NAC_CORD[0], NAC_CORD[1])
    const w145Marker = createMtaMarker(Logo145th, W145_CORD[0], W145_CORD[1])
    const w125Marker = createMtaMarker(Logo125th, W125_CORD[0], W125_CORD[1])

  return (
    <MapContainer center={center} zoom={zoom} className='absolute inset-0'>
        <TileLayer url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' />
        {nacMarker}
        {w125Marker}
        {w145Marker}
        {/* Commented out for now due to the tracker not providing polyline data */}
        {/* Entire Shuttle Route */}
        {/* <Polyline pathOptions={{ color: '#9ca3af' }} positions={shuttlePath} /> */}
        {/* Shuttle 1 Routing */}
        {/* <Polyline pathOptions={{ color: 'blue' }} positions={shuttle1route} /> */}
        {/* Shuttle 2 Routing */}
        {/* <Polyline pathOptions={{ color: 'orange' }} positions={shuttle2route} /> */}
        {/* Shuttle Markers */}
        {/* Add the 145th street route polyline */}
        {busRoute}
        {shuttle1Position && createShuttleMarker(shuttle1, shuttle1Position, shuttle1PreviousPosition)}
        {/* {createShuttleMarker(shuttle1, shuttle1Position)} */}
        {createShuttleMarker(shuttle2, shuttle2Position)}

      </MapContainer>
  )
}

export default MapPublic