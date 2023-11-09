import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader, 
  Polyline
} from "@react-google-maps/api";
import buss from '../assets/buss.png'
import { getDocs, collection, query, orderBy, limit, onSnapshot} from "firebase/firestore";
import { db } from "../firebase";
import polyline from "@mapbox/polyline";

const MapComponent = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markers, setMarkers] = useState({});
  const center = { lat: 40.81792206720871, lng: -73.94995404366331};
  const containerStyle = { width: "100%", height: "550px"};
  const shuttleIcon = {
    url: 'https://img.icons8.com/?size=77&id=46817&format=png', 
    scaledSize: { width: 33, height: 33 },
    anchor: { x: 15, y: 15 },
  };

  // gets the shuttle one data
  useEffect(() => {
    const q1 = query(collection(db, "CCNY_Shuttle_1"), orderBy("datetime", "desc"), limit(1));

    const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("1 datetime: ", doc.data().datetime, " lat: ", doc.data().locationlatitude, " long: ", doc.data().locationlongitude)
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
        }));
      });
    });

    return () => unsubscribe1();
  }, []);


  // get the shuttle two data
  useEffect(() => {
    const q2 = query(collection(db, "CCNY_Shuttle_2"), orderBy("datetime", "desc"), limit(1));

    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("2 datetime: ", doc.data().datetime, " lat: ", doc.data().locationlatitude, " long: ", doc.data().locationlongitude)
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
        }));
      });
    });

    return () => unsubscribe2();
  }, []);

  useEffect(() => {
    const q3 = query(collection(db, "CCNY_Shuttle_3"), orderBy("datetime", "desc"), limit(1));
  
    const unsubscribe3 = onSnapshot(q3, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("3 datetime: ", doc.data().datetime, " lat: ", doc.data().locationlatitude, " long: ", doc.data().locationlongitude)
        setMarkers(prevMarkers => ({
          ...prevMarkers,
          shuttle3: {
            position: {
              lat: doc.data().locationlatitude,
              lng: doc.data().locationlongitude,
            },
            icon: shuttleIcon,
            label: { color: "black", text: "3" },
            draggable: false,
          }
        }));
      });
    });
  
    return () => unsubscribe3();
  }, []);
  

  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng());
  };

  const markerClicked = (marker, index) => {
    setActiveInfoWindow(index);
    console.log(marker, index);
  };

  const markerDragEnd = (event, index) => {
    console.log(event.latLng.lat(), event.latLng.lng());
  };

  const BOUNDS = {
    north: 40.83,
    south: 40.81,
    east: -73.94,
    west: -73.96,
  };

  const onMapDragEnd = (map) => {
    const currentCenter = map.getCenter();
    let newLat = currentCenter.lat();
    let newLng = currentCenter.lng();

    if (currentCenter.lat() > BOUNDS.north) newLat = BOUNDS.north;
    if (currentCenter.lat() < BOUNDS.south) newLat = BOUNDS.south;
    if (currentCenter.lng() > BOUNDS.east) newLng = BOUNDS.east;
    if (currentCenter.lng() < BOUNDS.west) newLng = BOUNDS.west;

    if (newLat !== currentCenter.lat() || newLng !== currentCenter.lng()) {
      map.setCenter({ lat: newLat, lng: newLng });
    }
  };

  const encodedPolyline = "iqcxFbjjbMfEtC`@`@rA~CV\\lFlD`@PtL~@~CBpDJ~AbAJNlEpCZ_@pBgBr@sBYIg@[iAs@qBjGgC{AUBeBeAyDGqCEwL_Am@[_FcDa@k@iAqCu@q@sDeCaIgFiLwH}ByAqCmBvBwGz@`@lNdFcDbKjJjGpCfB";

  const decodedPath = polyline.decode(encodedPolyline);
  const formattedPath = decodedPath.map((point) => ({
    lat: point[0],
    lng: point[1],
  }));

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
        <Polyline
                path={formattedPath}
                options={{
                    strokeColor: "#8c7dc4",  // Color of the polyline. #5688f8 for blue line
                    strokeOpacity: 1,       // Opacity of the polyline.
                    strokeWeight: 2,        // Thickness of the polyline.
                }}
            />
        {Object.values(markers).map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.icon}
            label={marker.label}
            draggable={marker.draggable}
            onDragEnd={(event) => markerDragEnd(event, index)}
            onClick={(event) => markerClicked(marker, index)}
          >
            {activeInfoWindow === index && (
              <InfoWindow
                position={marker.position}
                onCloseClick={() => setActiveInfoWindow(null)}
              >
                <b>
                  {marker.position.lat}, {marker.position.lng}
                </b>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    )

  );
};

export default MapComponent;
