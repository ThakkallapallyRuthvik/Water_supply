// MapComponent.js

import React, { useState, useEffect } from 'react';
import { GoogleMap, StandaloneSearchBox, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent = ({ center, coordinates, houseCoords, junctionCoords, onMapClick }) => {
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [selectedHouseMarker, setSelectedHouseMarker] = useState(null);

  const onLoadMap = (map) => {
    setMap(map);
  };

  const onLoadSearchBox = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length > 0) {
      const selectedPlace = places[0].geometry.location;
      map.panTo({ lat: selectedPlace.lat(), lng: selectedPlace.lng() });
    }
  };

  const markerIndex = (index, markerType) => {
    if (markerType === 'house') {
      setSelectedHouseMarker(index);
    }
    // Add other marker types if needed

    // Your existing markerIndex logic
  };

  // Other functions, useEffect, and GoogleMap component

  return (
    <GoogleMap
      center={center}
      zoom={17}
      mapContainerStyle={{ width: '80%', height: '80%', left: '150px', top: '0' }}
      onLoad={onLoadMap}
      onClick={onMapClick}
    >
      {/* ... (existing markers, polylines, etc.) */}

      {/* Add the search box */}
      {map && (
        <StandaloneSearchBox
          onLoad={onLoadSearchBox}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </StandaloneSearchBox>
      )}

      {/* ... (existing code) */}
    </GoogleMap>
  );
};

export default MapComponent;
