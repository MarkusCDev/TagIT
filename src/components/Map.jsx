import React, { useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api'

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
    ]

    const [activeInfoWindow, setActiveInfoWindow] = useState(null);
    const [markers, setMarkers] = useState(initialMarkers);

    const containerStyle = {
      width: "100%",
      height: "400px",
    }

    const center = {
      lat: 40.81842005961102,
      lng: -73.95074082475607,
    }

    const mapClicked = (event) => {
      console.log(event.latLng.lat(), event.latLng.lng());
    }

    const markerClicked = (marker, index) => {
      setActiveInfoWindow(index);
      console.log(marker, index);
    }

    const markerDragEnd = (event, index) => {
      console.log(event.latLng.lat(), event.latLng.lng());
    }

    return (
      isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onClick={mapClicked}
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
                <InfoWindow position={marker.position} onCloseClick={() => setActiveInfoWindow(null)}>
                  <b>{marker.position.lat}, {marker.position.lng}</b>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      )
    )

}

export default MapComponent