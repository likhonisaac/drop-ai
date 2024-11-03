import { LatLngLiteral } from "leaflet";
import { useEffect } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";

export function LocationMarker({
  location,
  setLocation,
  onClick,
  goToCurrentLocation = false,
}: {
  location: LatLngLiteral | null;
  setLocation: React.Dispatch<React.SetStateAction<LatLngLiteral | null>>;
  onClick?: () => void;
  goToCurrentLocation?: boolean;
}) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
      if (onClick) onClick();
    },
    locationfound(e) {
      if (goToCurrentLocation) {
        setLocation(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return location ? (
    <Marker position={location}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}
