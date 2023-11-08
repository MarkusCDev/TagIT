import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import buss from '../assets/buss.png'
import { getDocs, collection, query, orderBy, limit, onSnapshot} from "firebase/firestore";
import { db } from "../firebase";

const MapComponent = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  const initialMarkers = [
    {
      position: {
        lat: 40.81842005961102,
        lng: -73.95074082475605,
      },
      label: { color: "black", text: "Campus" },
      draggable: true,
    },
  ];

  const shuttleIcon = {
    url: 'https://img.icons8.com/?size=77&id=46817&format=png', // The URL of the marker image
    scaledSize: { width: 33, height: 33 },
    anchor: { x: 15, y: 15 },
  };
  const campusIcon = {
    url: 'https://img.icons8.com/?size=77&id=4BZkx8s5bPF5&format=png',
    scaledSize: { width: 33, height: 33 }
  }


  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markers, setMarkers] = useState({
    campus: {
      position: {
        lat: 40.81842005961102,
        lng: -73.95074082475605,
      },
      icon: campusIcon,
      //label: { color: "black", text: "Campus" },
      draggable: true,
    }
  });

  const retData = async () => {
    const q = query(collection(db, "CCNY_Shuttle_1"), orderBy("datetime", "desc"), limit(1))
    const querySnapshot = await getDocs(q);
   querySnapshot.forEach((doc) => {
   console.log(doc.id, " => ", doc.data(), " lat: ", doc.data().locationlatitude, " long: ", doc.data().locationlongitude);
   });

  }

  useEffect(() => {
    const q1 = query(collection(db, "CCNY_Shuttle_1"), orderBy("datetime", "desc"), limit(1));

    const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setMarkers(prevMarkers => ({
          ...prevMarkers,
          shuttle1: {
            position: {
              lat: doc.data().locationlatitude,
              lng: doc.data().locationlongitude,
            },
            icon: shuttleIcon,
            label: { color: "black", text: "1" },
            draggable: true,
          }
        }));
      });
    });

    return () => unsubscribe1();
  }, []);

  useEffect(() => {
    const q2 = query(collection(db, "CCNY_Shuttle_2"), orderBy("datetime", "desc"), limit(1));

    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setMarkers(prevMarkers => ({
          ...prevMarkers,
          shuttle2: {
            position: {
              lat: doc.data().locationlatitude,
              lng: doc.data().locationlongitude,
            },
            icon: shuttleIcon,
            label: { color: "black", text: "2" },
            draggable: true,
          }
        }));
      });
    });

    return () => unsubscribe2();
  }, []);
  
  

  const containerStyle = {
    width: "520px",
    height: "520px",
  };

  const center = {
    lat: 40.81842005961102,
    lng: -73.95074082475607,
  };

  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng());

    // const newMarker = {
    //   position: {
    //     lat: event.latLng.lat(),
    //     lng: event.latLng.lng(),
    //   },
    //   label: { color: "black", text: "New Location" }, // Update the label text as needed
    //   draggable: true, // Set draggable to true or false as needed
    // };

    // setMarkers([newMarker]);

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
