import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

interface Pharmacy {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

// Correction for default Leaflet icon not showing correctly in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to fix Leaflet tiles loading issues in dynamic layouts
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

interface MapComponentProps {
  pharmacies: Pharmacy[];
  center?: [number, number];
}

export default function MapComponent({ pharmacies, center = [-4.2634, 15.2429] }: MapComponentProps) {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border-2 border-primary/10 shadow-lg relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full"
        key={`${center[0]}-${center[1]}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ResizeMap />
        {pharmacies.map((pharmacy) => (
          <Marker 
            key={pharmacy.id} 
            position={[pharmacy.lat, pharmacy.lng]}
          >
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-sm mb-1">{pharmacy.name}</h4>
                <p className="text-[11px] text-muted-foreground">{pharmacy.address}</p>
                <p className="text-[11px] font-semibold mt-1 text-primary">{pharmacy.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
