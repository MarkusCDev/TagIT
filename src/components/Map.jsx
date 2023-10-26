import React, { useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const MapComponent = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
  });

  const initialMarkers = [
    {
      position: {
        lat: 40.81842005961102,
        lng: -73.95074082475607,
      },
      label: { color: "black", text: "Campus" },
      draggable: true,
    },
  ];

  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markers, setMarkers] = useState(initialMarkers);

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
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
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
