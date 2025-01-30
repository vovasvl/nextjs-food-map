import { useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import Supercluster, { AnyProps, ClusterFeature, PointFeature } from 'supercluster';
import { useMapMarkersContext } from '@/contexts/MapMarkersContext';

const markerIcon = new L.DivIcon({
  className: 'marker-icon',
  html: `<img src="/markerIcon.svg" />`,
  iconSize: [52, 60],
  iconAnchor: [26, 60],
  popupAnchor: [0, -60],
});

const getClusterColors = (clusterCount: number) => {
  if (clusterCount < 10) {
    return { outer: 'rgba(181, 226, 140, 0.6)', inner: 'rgba(110, 204, 57, 0.6)' };
  } else if (clusterCount < 100) {
    return { outer: 'rgba(241, 211, 87, 0.6)', inner: 'rgba(240, 194, 12, 0.6)' };
  } else {
    return { outer: 'rgba(253, 156, 115, 0.6)', inner: 'rgba(241, 128, 23, 0.6)' };
  }
};

const clusterIcon = (clusterCount: number) => {
  const { outer, inner } = getClusterColors(clusterCount);

  return new L.DivIcon({
    className: 'cluster-marker',
    html: `
            <div style="position: absolute; width: 40px; height: 40px; margin-left: -20px; margin-top: -20px; border-radius: 20px; 
            background-color: ${outer};">
                <div style="width: 30px; height: 30px; margin-left: 5px; margin-top: 5px; text-align: center; align-content: center; border-radius: 15px; 
                background-color: ${inner};">
                    <span style="line-height: 30px; font: 12px 'Helvetica Neue', Arial, Helvetica, sans-serif;">
                      ${clusterCount}
                    </span>
                </div>
            </div>
        `,
  });
};

export function ClusteredMarkers() {
  const map = useMap();
  const { markedRestaurants } = useMapMarkersContext();
  const [clusters, setClusters] = useState<(ClusterFeature<AnyProps> | PointFeature<AnyProps>)[]>([]);

  useEffect(() => {
    const options = { radius: 70, maxZoom: 16 };
    const supercluster = new Supercluster(options);

    supercluster.load(markedRestaurants.map(item => ({
      type: 'Feature',
      id: item.global_id,
      properties: { cluster: false },
      geometry: {
        type: 'Point',
        coordinates: [item.geoData.coordinates[0], item.geoData.coordinates[1]],
      },
    })));

    const updateClusters = () => {
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      const clusters = supercluster.getClusters([
        bounds.getSouthWest().lng,
        bounds.getSouthWest().lat,
        bounds.getNorthEast().lng,
        bounds.getNorthEast().lat,
      ], zoom);
      setClusters(clusters);
    };

    map.on('moveend', updateClusters);
    updateClusters();

    return () => {
      map.off('moveend', updateClusters);
    };
  }, [map, markedRestaurants]);

  const handleClusterClick = (cluster: ClusterFeature<AnyProps> | PointFeature<AnyProps>) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const currentZoom = map.getZoom();
    const newZoom = Math.min(currentZoom + 2, map.getMaxZoom());

    map.setView([latitude, longitude], newZoom, {
      animate: true,
    });
  };

  return (
    <>
      {clusters.map(cluster =>
        cluster.properties.cluster ? (
          <Marker
            key={`cluster-${cluster.id}`}
            position={[cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]]}
            icon={clusterIcon(cluster.properties.point_count)}
            eventHandlers={{
              click: () => handleClusterClick(cluster),
            }}
          />
        ) : (
          <Marker
            key={cluster.id}
            position={[cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]]}
            icon={markerIcon}
          />
        )
      )}
    </>
  );
}