import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const MapBackground = ({ zoom }) => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoieGluZ3llYWgiLCJhIjoiY2toeWFsOXdsMGE3djJybjBzaGZkdWE2aSJ9.wqzmeUmjmYZiKeW3NGvIiw';

    const map = new mapboxgl.Map({
      container: 'map',
      center: [-73.971321,40.776676],
      zoom: zoom || 10.7,
      style: 'mapbox://styles/xingyeah/clk2yxv5y006s01pg4ws580kw'
    });

    // map.addControl(new mapboxgl.NavigationControl());

    // Cleanup map instance on component unmount
    return () => {
      map.remove();
    };
  }, [zoom]);

  return <div id="map" style={{ width: '97.5%', height: '97.5%', border: '0px solid #00684a' }} />;

};

export default MapBackground;
