import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

interface Props {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (
    lat: number,
    lng: number
  ) => void;
}

function LocationMarker({
  onLocationSelect,
  latitude,
  longitude,
}: Props) {
  const [position, setPosition] =
    useState<LatLngExpression | null>(
      latitude !== null &&
      longitude !== null
        ? [latitude, longitude]
        : null
    );

  useEffect(() => {
    if (
      latitude !== null &&
      longitude !== null
    ) {
      setPosition([
        latitude,
        longitude,
      ]);
    }
  }, [latitude, longitude]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);

      onLocationSelect(
        e.latlng.lat,
        e.latlng.lng
      );
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
}

function RecenterMap({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      latitude !== null &&
      longitude !== null
    ) {
      map.setView(
        [latitude, longitude],
        16
      );
    }
  }, [latitude, longitude, map]);

  return null;
}

function MapPicker({
  latitude,
  longitude,
  onLocationSelect,
}: Props) {
  return (
    <MapContainer
      center={[17.385, 78.4867]}
      zoom={11}
      minZoom={10}
      maxZoom={18}
      maxBounds={[
        [17.0, 78.0],
        [17.8, 79.0],
      ]}
      maxBoundsViscosity={1.0}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap
        latitude={latitude}
        longitude={longitude}
      />

      <LocationMarker
        latitude={latitude}
        longitude={longitude}
        onLocationSelect={
          onLocationSelect
        }
      />
    </MapContainer>
  );
}

export default MapPicker;