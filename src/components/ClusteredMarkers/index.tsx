import { useCallback, useEffect, useRef, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L, { LeafletMouseEvent } from 'leaflet';
import Supercluster, { AnyProps, ClusterFeature, PointFeature } from 'supercluster';
import { useMapMarkersContext } from '@/contexts/MapMarkersContext';
import { RestaurantInfoPopover } from '@/components/RestaurantInfoPopover';

const markerIcon = new L.DivIcon({
  className: 'marker-icon',
  html: `<img src="/markerIcon.svg" />`,
  iconSize: [34, 38],
  iconAnchor: [17, 38],
  popupAnchor: [0, -15],
});

const clusterIcon = (clusterCount: number) => {
  return new L.DivIcon({
    className: 'cluster-marker',
    html: `
      <div style="
        position: absolute;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        margin-top: -20px;
        border-radius: 50%;
        background-color: white;
        border: 2px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Geist', sans-serif;
        color: black;
      ">
        ${clusterCount}
      </div>
    `,
  });
};

export function ClusteredMarkers() {
  const map = useMap();
  const { markedRestaurants } = useMapMarkersContext();
  const [clusters, setClusters] = useState<(ClusterFeature<AnyProps> | PointFeature<AnyProps>)[]>([]);

  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const options = { radius: 70, maxZoom: 16 };
    const supercluster = new Supercluster(options);

    supercluster.load(markedRestaurants.map(item => ({
      type: 'Feature',
      id: item.global_id,
      properties: { cluster: false, restaurantInfo: {...item} },
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

  const handleMouseOver = useCallback((e: LeafletMouseEvent, markerId: string | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredMarker(markerId);
    e.target.openPopup();
  }, []);

  const handleMouseOut = useCallback((e: LeafletMouseEvent, markerId: string | null) => {
    timeoutRef.current = setTimeout(() => {
      if (hoveredMarker === markerId) {
        setHoveredMarker(null);
        e.target.closePopup();
      }
    }, 150); 
  }, [hoveredMarker]);

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
            eventHandlers={{
              mouseover: (e) => handleMouseOver(e, cluster.id?.toString() || null),
              mouseout: (e) => handleMouseOut(e, cluster.id?.toString() || null),
            }}
          >
            <Popup autoPan={false} >
              <RestaurantInfoPopover
                restaurant={ cluster.properties.restaurantInfo }
              />
            </Popup>
          </Marker>
        )
      )}
    </>
  );
}