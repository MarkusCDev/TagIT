import React, { useState, useEffect } from "react"
import {
  GoogleMap,
  useJsApiLoader, 
  Polyline
} from "@react-google-maps/api"
import { getDocs, collection, query, orderBy, limit, onSnapshot, where} from "firebase/firestore"
import { db } from "../firebase"
import polyline from "@mapbox/polyline"

const MapComponent = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  const [markers, setMarkers] = useState({})
  const center = { lat: 40.81792206720871, lng: -73.94995404366331}
  const containerStyle = { width: "100%", height: "550px"}
  const shuttleIcon = {
    url: 'https://img.icons8.com/?size=77&id=46817&format=png', 
    scaledSize: { width: 33, height: 33 },
    anchor: { x: 15, y: 15 },
  };

  function PolyPercentage(timestamp, duration) { 
    const formattedDuration = parseInt(duration.slice(0, -1), 10)
    const steps = 100/formattedDuration
    const currentTime = new Date()
    const initalTime = new Date(timestamp)
    const elapsedTime = (currentTime - initalTime) / 1000
    const traveledPercent = (steps * elapsedTime)
    const remainingPercent = 100 - traveledPercent
    const remainingPercentString = remainingPercent.toString() + "%"
    
    if (traveledPercent > 100){ return "100%" }
    if (traveledPercent < 0 ){return "0%" }
    return traveledPercent
  }

  // gets the shuttle one data
  useEffect(() => {
    const q1 = query(collection(db, "CCNY_Shuttle_1"), orderBy("datetime", "desc"), limit(1))

    const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log("1 datetime: ", doc.data().datetime, " lat: ", doc.data().locationlatitude, " long: ", doc.data().locationlongitude)
        setMarkers(prevMarkers => ({
          ...prevMarkers,
          shuttle1: {
            position: {
              lat: doc.data().locationlatitude,
              lng: doc.data().locationlongitude,
            },
            icon: shuttleIcon,
            label: { color: "black", text: "1" },
            draggable: false,
          }
        }))
      })
    })

    return () => unsubscribe1()
  }, []);


  // get the shuttle two data
  useEffect(() => {
    const q2 = query(collection(db, "CCNY_Shuttle_2"), orderBy("datetime", "desc"), limit(1))

    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log("2 datetime: ", doc.data().datetime, " lat: ", doc.data().locationlatitude, " long: ", doc.data().locationlongitude)
        setMarkers(prevMarkers => ({
          ...prevMarkers,
          shuttle2: {
            position: {
              lat: doc.data().locationlatitude,
              lng: doc.data().locationlongitude,
            },
            icon: shuttleIcon,
            label: { color: "black", text: "2" },
            draggable: false,
          }
        }))
      })
    })

    return () => unsubscribe2()
  }, []);

  //Shuttle Bus 3, uncomment to include

  // useEffect(() => {
  //   const q3 = query(collection(db, "CCNY_Shuttle_3"), orderBy("datetime", "desc"), limit(1))
  
  //   const unsubscribe3 = onSnapshot(q3, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       console.log("3 datetime: ", doc.data().datetime, " lat: ", doc.data().locationlatitude, " long: ", doc.data().locationlongitude)
  //       setMarkers(prevMarkers => ({
  //         ...prevMarkers,
  //         shuttle3: {
  //           position: {
  //             lat: doc.data().locationlatitude,
  //             lng: doc.data().locationlongitude,
  //           },
  //           icon: shuttleIcon,
  //           label: { color: "black", text: "3" },
  //           draggable: false,
  //         }
  //       }));
  //     });
  //   });
  
  //   return () => unsubscribe3()
  // }, [])
  

  // Uncomment to click on map and console log lat/long
  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng())
  }


  // Uncomment to click on bus icons and display lat/long
  const markerClicked = (marker, index) => {
    setActiveInfoWindow(index)
    console.log(marker, index)
  }

  // Uncomment to console log clicked lat/long
  // const markerDragEnd = (event, index) => {
  //   console.log(event.latLng.lat(), event.latLng.lng())
  // }

  const BOUNDS = {
    north: 40.83,
    south: 40.81,
    east: -73.94,
    west: -73.96,
  }

  const onMapDragEnd = (map) => {
    const currentCenter = map.getCenter();
    let newLat = currentCenter.lat()
    let newLng = currentCenter.lng()

    if (currentCenter.lat() > BOUNDS.north) newLat = BOUNDS.north
    if (currentCenter.lat() < BOUNDS.south) newLat = BOUNDS.south
    if (currentCenter.lng() > BOUNDS.east) newLng = BOUNDS.east
    if (currentCenter.lng() < BOUNDS.west) newLng = BOUNDS.west

    if (newLat !== currentCenter.lat() || newLng !== currentCenter.lng()) {
      map.setCenter({ lat: newLat, lng: newLng })
    }
  }
  
  const [shuttle1route, setShuttle1Route] = useState('') 
  const [shuttle1routeduration, setShuttle1RouteDuration] = useState(0)
  const [busOffset, setBusOffset] = useState('0%')
  
  function convertToSeconds(timeStr) { 
    let seconds = parseInt(timeStr)
    return seconds
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("name", "==", "CCNY Shuttle 1"));
        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setShuttle1Route(decodeAndFormatPolyline(doc.data().polyline))
            setShuttle1RouteDuration(convertToSeconds(doc.data().duration))
            // setBusOffset('0%')
            const pt = PolyPercentage(doc.data().datetime, doc.data().duration)
            setBusOffset(pt)
            console.log("CCNY Shuttle 1: datetime", doc.data().datetime," arrivaltime", doc.data().arrivaltime, " duration", doc.data().duration, " polyline", pt)
            console.log(convertToSeconds(doc.data().duration))
          })
        })
      } catch (e) {
        console.log(e)
      }
    }
  
    fetchData()
  }, [])

  useEffect(() => {
    console.log("timer")
    let intervalId;
    // Calculate the increment step based on the shuttle1routeduration
    const incrementStep = 100 / shuttle1routeduration; 
    const startInterval = () => {
      intervalId = setInterval(() => {
        setBusOffset((prevOffset) => {
          // Use the incrementStep for updating the new offset
          const newOffset = parseFloat(prevOffset) + incrementStep;
          if (newOffset >= 100) {
            clearInterval(intervalId); // Clear the interval when it reaches 100%
            return '100%'; // Ensure the offset is exactly 100%
          }
          return `${newOffset}%`;
        });
      }, 1000); // Runs every second
    };

    // Clear any existing interval and start a new one
    clearInterval(intervalId);
    startInterval();

    // Cleanup function to clear the interval when the component unmounts or the effect re-runs
    return () => clearInterval(intervalId);
}, [shuttle1routeduration]); // Include shuttle1routeduration in the dependencies array
  

  ////////////////////////////////////////
  
  const [shuttle2route, setShuttle2Route] = useState('') 
  const [shuttle2routeduration, setShuttle2RouteDuration] = useState(0)
  const [busOffset2, setBusOffset2] = useState('0%')
  
  function convertToSeconds(timeStr) { 
    let seconds = parseInt(timeStr)
    return seconds
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q1 = query(collection(db, "CCNY_Shuttle_Routing"), orderBy("datetime", "desc"), limit(1), where("name", "==", "CCNY Shuttle 2"))

        const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setShuttle2Route(decodeAndFormatPolyline(doc.data().polyline))
            setShuttle2RouteDuration(convertToSeconds(doc.data().duration))
            // setBusOffset2('0%')
            const pt = PolyPercentage(doc.data().datetime, doc.data().duration)
            setBusOffset2(pt)
            console.log("CCNY Shuttle 2: datetime", doc.data().datetime," arrivaltime", doc.data().arrivaltime, " duration", doc.data().duration, " polyline", pt)
            console.log(convertToSeconds(doc.data().duration))
          })
        })
      } catch (e) {
        console.log(e)
      }
    }
  
    fetchData()
  }, [])

  useEffect(() => {
    let intervalId;

    // Calculate the increment step. The total number of updates is shuttle2routeduration (assuming it's in seconds), so divide 100 by shuttle2routeduration.
    const incrementStep = 100 / shuttle2routeduration;

    const startInterval = () => {
      intervalId = setInterval(() => {
        setBusOffset2((prevOffset) => {
          // Update the offset using the increment step
          const newOffset = parseFloat(prevOffset) + incrementStep;
          if (newOffset >= 100) {
            clearInterval(intervalId); // Clear the interval when it reaches 100%
            return '100%'; // Ensure the offset is exactly 100%
          }
          return `${newOffset}%`;
        });
      }, 1000); // Set the interval to every second
    };

    // Clear any existing interval and start a new one
    clearInterval(intervalId);
    startInterval();

    // Cleanup function to clear the interval when the component unmounts or the effect re-runs
    return () => clearInterval(intervalId);
}, [shuttle2routeduration]); // Dependency array includes shuttle2routeduration

  ////////////////////////////////////////

  function decodeAndFormatPolyline(encodedPolyline) {
    const decodedPath = polyline.decode(encodedPolyline)
    return decodedPath.map(point => ({ lat: point[0], lng: point[1] }))
  }

  //polyline for entire route
  const formattedPathRoute = decodeAndFormatPolyline("iqcxFbjjbMfEtC`@`@rA~CV\\lFlD`@PtL~@~CBpDJ~AbAJNlEpCZ_@pBgBr@sBYIg@[iAs@qBjGgC{AUBeBeAyDGqCEwL_Am@[_FcDa@k@iAqCu@q@sDeCaIgFiLwH}ByAqCmBvBwGz@`@lNdFcDbKjJjGpCfB")

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14.9}
        onClick={mapClicked}
        options={{
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: false,
          zoomControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUI: true,
          gestureHandling: "none",
          scrollwheel: false,
          styles: [
            {
              featureType: "administrative",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.attraction",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.government",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.business",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.place_of_worship",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.sports_complex",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
        onDragEnd={(e) => onMapDragEnd(e)}
      >
       {/* Polyline for Bus Route */}
        <Polyline
                path={formattedPathRoute}
                options={{
                    strokeColor: "#8c7dc4",  // Color of the polyline. #5688f8 for blue line
                    strokeOpacity: 1,       // Opacity of the polyline.
                    strokeWeight: 2,
                }}
            />
        {/* Polyline for Bus 1 Routing */}
        <Polyline
                path={shuttle1route}
                options={{
                    strokeColor: "#8c7dc4",  // Color of the polyline. #5688f8 for blue line
                    strokeOpacity: 1,        // Opacity of the polyline.
                    strokeWeight: 2,         
                    icons: [
                      {
                        icon: {
                          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                          scale: 4,
                          strokeColor: '#0080FF',
                        },
                        offset: busOffset,
                      },
                    ],        // Thickness of the polyline.
                }}
            />
        {/* Polyline for Bus 2 Routing*/}
        <Polyline
                path={shuttle2route}
                options={{
                    strokeColor: "#8c7dc4",  // Color of the polyline. #5688f8 for blue line
                    strokeOpacity: 1,        // Opacity of the polyline.
                    strokeWeight: 2,         
                    icons: [
                      {
                        icon: {
                          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                          scale: 4,
                          strokeColor: '#FF7F00',
                        },
                        // icon: customSymbol,
                        offset: busOffset2,
                      },
                    ],        // Thickness of the polyline.
                }}
            />
      </GoogleMap>
    )

  );
};

export default MapComponent
