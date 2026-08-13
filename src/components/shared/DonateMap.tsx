import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useI18n } from '@/i18n/useI18n';
import { directionsUrl } from '@/lib/maps';
import 'leaflet/dist/leaflet.css';

export interface MapMarkerItem {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  subtitle?: string;
}

interface DonateMapProps {
  markers: MapMarkerItem[];
  userCoords?: { lat: number; lng: number } | null;
  onSelect: (id: string) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [7.5, 2.1]; // Bénin
const DEFAULT_ZOOM = 7;

function createPinIcon() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" fill="none">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 26 16 26s16-15.5 16-26C32 7.163 24.837 0 16 0z" fill="#8F2346"/>
      <circle cx="16" cy="16" r="6.5" fill="#FAF8F5"/>
    </svg>`,
  );
  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -36],
  });
}

const pinIcon = createPinIcon();

function FitBounds({
  markers,
  userCoords,
}: {
  markers: MapMarkerItem[];
  userCoords?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = markers.map((m) => [m.lat, m.lng]);
    if (userCoords) points.push([userCoords.lat, userCoords.lng]);

    if (points.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }

    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 13 });
  }, [map, markers, userCoords]);

  return null;
}

export function DonateMap({ markers, userCoords = null, onSelect, className = '' }: DonateMapProps) {
  const { t } = useI18n();

  const center = useMemo<[number, number]>(() => {
    if (userCoords) return [userCoords.lat, userCoords.lng];
    if (markers.length === 1) return [markers[0].lat, markers[0].lng];
    if (markers.length > 1) {
      const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length;
      const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length;
      return [lat, lng];
    }
    return DEFAULT_CENTER;
  }, [markers, userCoords]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-warmgray-200/80 shadow-sm shadow-primary-900/[0.04] bg-surface h-full min-h-[min(70vh,560px)] ${className}`}
    >
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        className="absolute inset-0 h-full w-full z-0"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} userCoords={userCoords} />

        {userCoords && (
          <CircleMarker
            center={[userCoords.lat, userCoords.lng]}
            radius={9}
            pathOptions={{
              color: '#E86A5B',
              fillColor: '#E86A5B',
              fillOpacity: 0.85,
              weight: 3,
            }}
          >
            <Popup>{t('centers.map.you')}</Popup>
          </CircleMarker>
        )}

        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={pinIcon}>
            <Popup>
              <div className="min-w-[168px] max-w-[240px]">
                <p className="font-semibold text-sm text-[#241c20] leading-snug mb-0.5">{m.name}</p>
                <p className="text-xs text-[#6f6669] mb-2.5">
                  {m.city}
                  {m.subtitle ? ` · ${m.subtitle}` : ''}
                </p>
                <div className="flex flex-col gap-1.5">
                  <a
                    href={directionsUrl(m.lat, m.lng, userCoords)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center rounded-full border border-[#8F2346] text-[#8F2346] text-xs font-semibold px-3 py-1.5 hover:bg-[#8F2346]/[0.06] transition-colors"
                  >
                    {t('centers.map.directions')}
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelect(m.id)}
                    className="w-full rounded-full bg-[#8F2346] text-white text-xs font-semibold px-3 py-1.5 hover:bg-[#691735] transition-colors"
                  >
                    {t('centers.map.details')}
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {markers.length === 0 && (
        <div className="absolute inset-0 z-[400] flex items-center justify-center bg-background/70 backdrop-blur-[2px] pointer-events-none">
          <p className="text-sm font-medium text-warmgray-600 px-4 text-center">
            {t('centers.map.empty')}
          </p>
        </div>
      )}
    </div>
  );
}
