import { useEffect } from 'react';
import bScoreData from '../json-files/all_nodes.json';

const useHeatmap = (map, isHeatmapVisible) => {
  const hour = 0;  // Use a default hour value of 0

  // Prepare GeoJSON data from bScoreData
  const geoJSONData = {
    type: 'FeatureCollection',
    features: bScoreData.data.map(node => ({
      type: 'Feature',
      properties: {
        'b-score': node['b-score'][hour]
      },
      geometry: {
        type: 'Point',
        coordinates: [node.location.longitude, node.location.latitude]
      }
    }))
  };

  useEffect(() => {
    if (!map.current) return;

    map.current.on('load', () => {
      map.current.addSource('heatmap-source', {
        type: 'geojson',
        data: geoJSONData
      });

      map.current.addLayer({
        id: 'b-score-layer',
        type: 'circle',
        source: 'heatmap-source',
        paint: {
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'b-score'],
            -1, 'green',
            0, 'yellow',
            1, 'red'
          ],
          'circle-radius': 10,
          'circle-opacity': 0.5
        }
      });
      // Set the initial visibility of the layer
      map.current.setLayoutProperty('b-score-layer', 'visibility', isHeatmapVisible ? 'visible' : 'none');
    });
  }, [map, isHeatmapVisible]);

  // Additional hook for unchecks
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && map.current.getLayer('b-score-layer')) {
      map.current.setLayoutProperty('b-score-layer', 'visibility', isHeatmapVisible ? 'visible' : 'none');
    }
  }, [map, isHeatmapVisible]);
};

export default useHeatmap;
