import { useEffect, useContext } from 'react';
import bScoreData from '../json-files/all_nodes_with_crime_in_bscore.json';
import taxiGeoJSON from '../json-files/taxi.json'; // Replace with the actual path to the taxi.json file
import { ArrayContext, useWaypointsArray } from "../context/ArrayContext";
import { MapInputContext } from '../context/MapInputContext';
import { useMapInput } from '../context/MapInputContext';

const useHeatmap = (map, isHeatmapVisible) => {
  const { globalArray, setGlobalArrayValue } = useWaypointsArray();
  const { inputValues, setInputValues } = useContext(MapInputContext);
  let hour = 12;

  // Prepare GeoJSON data from bScoreData
  const geoJSONData = {
    type: 'FeatureCollection',
    features: taxiGeoJSON.features.map((feature) => {
      const taxiZoneNodes = bScoreData.data.filter((node) => node['taxi-zone'] === feature.properties.id);
      const totalBScore = taxiZoneNodes.reduce((acc, node) => acc + node['b-score'][hour], 0);
      const averageBScore = totalBScore / taxiZoneNodes.length;

      return {
        type: 'Feature',
        properties: {
          'b-score': averageBScore,
        },
        geometry: feature.geometry,
      };
    }),
  };

  useEffect(() => {
    // if (!map.current) return;

    hour = inputValues.hour;  // Use a default hour value of 0

    map.current.on('load', () => {
      // Add the taxi.geojson data as a source
      map.current.addSource('taxi-source', {
        type: 'geojson',
        data: taxiGeoJSON,
      });

      // Add a layer for the edges of taxi zones (black line)
      map.current.addLayer({
        id: 'taxi-zone-edges',
        type: 'line',
        source: 'taxi-source',
        paint: {
          'line-color': 'black', // Color of the outline
          'line-width': 2, // Width of the outline
        },
        filter: ['==', ['get', 'type'], 'taxi-zone'], // Filter to display only taxi zone features
      });

      // Add the bScoreData as another source
      map.current.addSource('heatmap-source', {
        type: 'geojson',
        data: geoJSONData,
      });

      // Add a layer for the bScoreData heatmap
      map.current.addLayer({
        id: 'b-score-layer',
        type: 'fill',
        source: 'heatmap-source',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'b-score'],
            0,
            '#00684a',
            0.35,
            '#ffff33',
            0.7,
            '#ff0000',
          ],
          'fill-opacity': 0.5,
        },
      });
      // Set the initial visibility of the layer
      map.current.setLayoutProperty('b-score-layer', 'visibility', isHeatmapVisible ? 'visible' : 'none');
    });
  }, [map, isHeatmapVisible, inputValues.hour]);

  // Additional hook for unchecks
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && map.current.getLayer('b-score-layer')) {
      map.current.setLayoutProperty('b-score-layer', 'visibility', isHeatmapVisible ? 'visible' : 'none');
      map.current.setLayoutProperty('taxi-zone-edges', 'visibility', isHeatmapVisible ? 'visible' : 'none');
    }
  }, [map, isHeatmapVisible]);
};

export default useHeatmap;
