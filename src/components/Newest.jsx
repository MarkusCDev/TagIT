import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { getDocs, collection, query, orderBy, limit, onSnapshot, where} from "firebase/firestore"
import { db } from "../firebase"
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import shuttle1 from '../assets/shuttle1R.png'
import shuttle2 from '../assets/shuttle2R.png'
import mta from '../assets/mta.png'
import castle from '../assets/castle.png'

const Newest = () => {
    const [shuttle1route, setShuttle1Route] = useState('')
    const [shuttle2route, setShuttle2Route] = useState('')
    const [shuttle1duration, setShuttle1Duration] = useState('')
    const [shuttle2duration, setShuttle2Duration] = useState('')
    const [shuttle1Position, setShuttle1Position] = useState(null)
    const [shuttle2Position, setShuttle2Position] = useState(null)
    const [shutte1offset, setShuttle1Offset] = useState(0)
    const [shutte2offset, setShuttle2Offset] = useState(0)

    //////////////////////////// Firebase Query /////////////////////////////////////////

    useEffect(() => {
        const fetchData = async () => {
          try {
            //Query for CCNY Shuttle 1
            const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("name", "==", "CCNY Shuttle 1"));
            const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const decodedPoly1 = decodeAndFormatPolyline(doc.data().polyline)
                console.log("CCNY Shuttle 1: datetime", doc.data().datetime, " arrivaltime", doc.data().arrivaltime, " duration", doc.data().duration, " polyline", decodedPoly1, " delta_duration", doc.data().duration_delta);
                setShuttle1Route(decodedPoly1)
                setShuttle1Duration(convertToSeconds(doc.data().duration_delta))
                // setShuttle1Position(null)
                setShuttle1Offset(startHere(doc.data().datetime, doc.data().duration_delta))
              });
            });
      
            // Query for CCNY Shuttle 2
            const q2 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("name", "==", "CCNY Shuttle 2"));
            const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const decodedPoly2 = decodeAndFormatPolyline(doc.data().polyline)
                console.log("CCNY Shuttle 2: datetime", doc.data().datetime, " arrivaltime", doc.data().arrivaltime, " duration", doc.data().duration, " polyline", decodedPoly2, " delta_duration", doc.data().duration_delta);
                setShuttle2Route(decodedPoly2)
                setShuttle2Duration(convertToSeconds(doc.data().duration_delta))
                //setShuttle1Position(null)
                setShuttle2Offset(startHere(doc.data().datetime, doc.data().duration_delta))
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
      

    /////////////////////////////// Animation Handeling ///////////////////////////////////////

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
    
    const animateShuttle = (route, setShuttlePosition, duration, startAt) => {
        const interpolatedRoute = interpolatePoints(route, duration);
        let step = startAt < interpolatedRoute.length ? startAt : 0;
    
        const intervalId = setInterval(() => {
            setShuttlePosition(interpolatedRoute[step]);
            step++;
            if (step >= interpolatedRoute.length) clearInterval(intervalId);
        }, 1000);
    };

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
            iconSize: [25, 41],
            iconAnchor: [12.5, 20.5]
        });

        return <Marker position={position} icon={icon} />;
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////

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
        
        console.log("int time:", initialTime)
        console.log("elapsed time:", elapsedTime)
        if (elapsedTime > delta_duration) {return delta_duration - 1}
        if (elapsedTime < 0) {return 0}
        return elapsedTime
    }
    

    function convertToSeconds(timeStr) { 
        let seconds = parseInt(timeStr)
        return seconds
      }

    function decodeAndFormatPolyline(encodedPolyline) {
        const decodedPath = polyline.decode(encodedPolyline);
        return decodedPath.map(point => ({ lat: point[0], lng: point[1] }));
      }

    const center = [40.81792206720871, -73.94995404366331];
    const zoom = 15;
    const shuttlePath = decodeAndFormatPolyline('iqcxFbjjbMfEtC`@`@rA~CV\\lFlD`@PtL~@~CBpDJ~AbAJNlEpCZ_@pBgBr@sBYIg@[iAs@qBjGgC{AUBeBeAyDGqCEwL_Am@[_FcDa@k@iAqCu@q@sDeCaIgFiLwH}ByAqCmBvBwGz@`@lNdFcDbKjJjGpCfB');

    const createMtaMarker = (imageUrl, lat, lng) => {
        const icon = L.icon({
          iconUrl: imageUrl,
          iconSize: [10, 17],
          iconAnchor: [5, 8.5]
        });
      
        return <Marker position={[lat, lng]} icon={icon} />;
      };

    const createNacMarker = (imageUrl, lat, lng) => {
        const icon = L.icon({
          iconUrl: imageUrl,
          iconSize: [25, 41],
          iconAnchor: [13, 21]
        });
      
        return <Marker position={[lat, lng]} icon={icon} />;
      };

    const nacMarker = createNacMarker(castle, 40.82001421347782, -73.94900569957996)
    const w145Marker = createMtaMarker(mta, 40.810790169812186, -73.95259361484852)
    const w125Marker = createMtaMarker(mta, 40.823866173326145, -73.94489315828145)

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '550px', width: '100%' }} touchZoom={false} scrollWheelZoom={false} boxZoom={false} zoomControl={false} dragging={false} doubleClickZoom={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        {nacMarker}
        {w125Marker}
        {w145Marker}
        {/* Entire Shuttle Route */}
        <Polyline pathOptions={{ color: '#8c7dc4' }} positions={shuttlePath} />

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

export default Newest