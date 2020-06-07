import React from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

const leafMap = () => {

  const position = [51.505, -0.09,]

  return (
    
    <Map center={position} zoom={15}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* <Marker position={selectedPosition} ></Marker> */}

    </Map>

  );
};

export default leafMap;