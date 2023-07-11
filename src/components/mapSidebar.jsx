import React from 'react';

const Sidebar = ({ lat, lng, zoom }) => (
  <div className="sidebar">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
  </div>
);

export default Sidebar;
