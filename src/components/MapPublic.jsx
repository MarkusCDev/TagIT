import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import shuttle1 from '../assets/shuttle1R.png'
import shuttle2 from '../assets/shuttle2R.png'

import CCNY from '../assets/CCNY-Logo-Only.png'
import Logo125th from '../assets/125thStationMarker.png'
import Logo145th from '../assets/145thStationMarker.png'

const MapPublic = ( {shuttle1prop, shuttle2prop} ) => {
    const [shuttle1route, setShuttle1Route] = useState('')
    const [shuttle2route, setShuttle2Route] = useState('')
    const [shuttle1duration, setShuttle1Duration] = useState('')
    const [shuttle2duration, setShuttle2Duration] = useState('')
    const [shuttle1Position, setShuttle1Position] = useState(null)
    const [shuttle2Position, setShuttle2Position] = useState(null)
    const [shutte1offset, setShuttle1Offset] = useState(0)
    const [shutte2offset, setShuttle2Offset] = useState(0)

    let mql = window.matchMedia("(max-width: 1024px)");
    let mql2 = window.matchMedia("(max-height: 700px)")
    const [mobile, setMobile] = useState(mql.matches);
    const [zoomIn, setZoomIn] = useState(mql2.matches);

    useEffect(() => {
      let mql = window.matchMedia("(max-width: 1024px)");
      setMobile(mql.matches);
      let mql2 = window.matchMedia("(max-height: 700px)");
      setZoomIn(mql2.matches);
    }, [])

    //////////////////////////// Hardcoded PolyLine //////////////////////////////////////

    // Used to ensure bus polyline updates once it reaaches a train stop (145/125)
    // despite no airtag updates it will show the bus going back to campus

    const To145Poly = "iqcxFbjjbMaIgFiLwH}ByAqCmBvBwGz@`@"
    const ToNacFrom145Poly = "kkdxFfkibMfNbFcDbKjJjGpCfB"
    const To125Poly =  "iqcxFbjjbMfEtC`@`@rA~CV\\lFlD`@PtL~@~CBpDJ~AbAJNlEpCZ_@pBgBr@sBYIg@["
    const ToNacFrom125Poly = "axaxFl|jbMiAs@sBnGeC_BUBeBeAyDGqCEwL_Am@[_FcDa@k@iAqCu@q@sDeC"

    //////////////////////////// Shuttle Bus Data /////////////////////////////////////////

    // Checks for updates of shuttle1data passed from landing map firebase query
    useEffect (() => {
      console.log("shut 1 mapping", shuttle1prop)

        if (shuttle1prop && shuttle1prop.polyline && shuttle1prop.duration_delta && shuttle1prop.datetime) {
          const decodedPoly1 = decodeAndFormatPolyline(shuttle1prop.polyline)

          setShuttle1Route(decodedPoly1)
          setShuttle1Duration(convertToSeconds(shuttle1prop.duration_delta))
          setShuttle1Offset(startHere(shuttle1prop.datetime, shuttle1prop.duration_delta))
        }

    }, [shuttle1prop])

    // Checks for updates of shuttle2data passed from landing map firebase query
    useEffect (() => {

      console.log("shut 2 mapping", shuttle2prop)

        if (shuttle2prop && shuttle2prop.polyline && shuttle2prop.duration_delta && shuttle2prop.datetime) {
          const decodedPoly2 = decodeAndFormatPolyline(shuttle2prop.polyline)
          setShuttle2Route(decodedPoly2)
          setShuttle2Duration(convertToSeconds(shuttle2prop.duration_delta))
          setShuttle2Offset(startHere(shuttle2prop.datetime, shuttle2prop.duration_delta))
        }

    }, [shuttle2prop])  

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
    const animateShuttle = (route, setShuttlePosition, duration, startAt) => {
      
        
      const interpolatedRoute = interpolatePoints(route, duration);
        let step = startAt < interpolatedRoute.length ? startAt : 0;
    
        const intervalId = setInterval(() => {
            setShuttlePosition(interpolatedRoute[step]);
            step++;
            if (step >= interpolatedRoute.length) clearInterval(intervalId);
        }, 1000);
    };

    // Updates routing animation 
    useEffect(() => {
        if (shuttle1route.length && shuttle1duration) {
            animateShuttle(shuttle1route, setShuttle1Position, shuttle1duration, shutte1offset);
        }
    }, [shuttle1route, shuttle1duration, shutte1offset]);
    
    useEffect(() => {
        if (shuttle2route.length && shuttle2duration) {
            animateShuttle(shuttle2route, setShuttle2Position, shuttle2duration, shutte2offset);
        }
    }, [shuttle2route, shuttle2duration, shutte2offset]);
    

    const createShuttleMarker = (imageUrl, position) => {
        if (!position) return null;

        const icon = L.icon({
            iconUrl: imageUrl,
            iconSize: [41, 25],
            iconAnchor: [20.5, 12.5]
        });

        return <Marker position={position} icon={icon} />;
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

    // Leaflet mapping restrictions
    const center = [40.81792206720871, -73.94995404366331];
    const mobileCenter = [40.81311458493628, -73.95070408860828];
    const zoom = zoomIn ? 14 : 15;
    const shuttlePath = decodeAndFormatPolyline('iqcxFbjjbMfEtC`@`@rA~CV\\lFlD`@PtL~@~CBpDJ~AbAJNlEpCZ_@pBgBr@sBYIg@[iAs@qBjGgC{AUBeBeAyDGqCEwL_Am@[_FcDa@k@iAqCu@q@sDeCaIgFiLwH}ByAqCmBvBwGz@`@lNdFcDbKjJjGpCfB');

    // Create MTA marker
    const createMtaMarker = (imageUrl, lat, lng) => {
        const icon = L.icon({
          iconUrl: imageUrl,
          iconSize: [25, 27],
          iconAnchor: [12.5, 13.5]
        });
      
        return <Marker position={[lat, lng]} icon={icon} />;
      };


    // Create NAC marker
    const createNacMarker = (imageUrl, lat, lng) => {
        const icon = L.icon({
          iconUrl: imageUrl,
          iconSize: [40, 42],
          iconAnchor: [10, 21]
        });
      
        return <Marker position={[lat, lng]} icon={icon} />;
      };

    // Marker Data 
    const nacMarker = createNacMarker(CCNY, 40.82001421347782, -73.94900569957996)
    const w145Marker = createMtaMarker(Logo145th, 40.810790169812186, -73.95259361484852)
    const w125Marker = createMtaMarker(Logo125th, 40.823866173326145, -73.94489315828145)

  return (
    <MapContainer center={mobile === true ? mobileCenter : center} zoom={zoom} className='absolute inset-0' touchZoom={false} scrollWheelZoom={false} boxZoom={false} zoomControl={false} dragging={false} doubleClickZoom={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        {nacMarker}
        {w125Marker}
        {w145Marker}
        {/* Entire Shuttle Route */}
        <Polyline pathOptions={{ color: '#9ca3af' }} positions={shuttlePath} />

        {/* Shuttle 1 Routing */}
        <Polyline pathOptions={{ color: 'blue' }} positions={shuttle1route} />
        {/* Shuttle 2 Routing */}
        <Polyline pathOptions={{ color: 'orange' }} positions={shuttle2route} />
        {/* Shuttle Markers */}
        {createShuttleMarker(shuttle1, shuttle1Position)}
        {createShuttleMarker(shuttle2, shuttle2Position)}

      </MapContainer>
  )
}

export default MapPublic