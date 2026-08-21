import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Maximize2, Minimize2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { directionsUrl } from '@/lib/maps';
import { themeColors } from '@/lib/theme-colors';
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

const DEFAULT_CENTER: [number, number] = [7.5, 2.1];
const DEFAULT_ZOOM = 7;

function createPinIcon() {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" fill="none">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 26 16 26s16-15.5 16-26C32 7.163 24.837 0 16 0z" fill="${themeColors.primary}"/>
      <circle cx="16" cy="16" r="6.5" fill="${themeColors.background}"/>
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

function fitMapToPoints(
  map: L.Map,
  markers: MapMarkerItem[],
  userCoords?: { lat: number; lng: number } | null,
) {
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
}

function FitBounds({
  markers,
  userCoords,
  recenterToken,
}: {
  markers: MapMarkerItem[];
  userCoords?: { lat: number; lng: number } | null;
  recenterToken: number;
}) {
  const map = useMap();

  useEffect(() => {
    fitMapToPoints(map, markers, userCoords);
  }, [map, markers, userCoords, recenterToken]);

  return null;
}

export function DonateMap({ markers, userCoords = null, onSelect, className = '' }: DonateMapProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [recenterToken, setRecenterToken] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement === el) {
      await document.exitFullscreen();
      return;
    }

    await el.requestFullscreen();
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-surface ${
        isFullscreen
          ? 'h-screen w-screen rounded-none border-0'
          : `rounded-2xl border border-warmgray-200/80 shadow-sm shadow-primary-900/[0.04] h-full min-h-[min(70vh,560px)] ${className}`
      }`}
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
        <FitBounds
          markers={markers}
          userCoords={userCoords}
          recenterToken={recenterToken}
        />

        {userCoords && (
          <CircleMarker
            center={[userCoords.lat, userCoords.lng]}
            radius={9}
            pathOptions={{
              color: themeColors.accent,
              fillColor: themeColors.accent,
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
                <p className="font-semibold text-sm text-foreground leading-snug mb-0.5">{m.name}</p>
                <p className="text-xs text-muted mb-2.5">
                  {m.city}
                  {m.subtitle ? ` · ${m.subtitle}` : ''}
                </p>
                <div className="flex flex-col gap-1.5">
                  <a
                    href={directionsUrl(m.lat, m.lng, userCoords)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center rounded-full border border-primary text-primary text-xs font-semibold px-3 py-1.5 hover:bg-primary/[0.06] transition-colors"
                  >
                    {t('centers.map.directions')}
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelect(m.id)}
                    className="w-full rounded-full bg-primary text-white text-xs font-semibold px-3 py-1.5 hover:bg-primary-dark transition-colors"
                  >
                    {t('centers.map.details')}
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-3 right-3 z-[500] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setRecenterToken((n) => n + 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warmgray-200/90 bg-surface/95 text-primary-800 shadow-md backdrop-blur-sm hover:bg-primary-50 transition-colors"
          aria-label={t('centers.map.recenter')}
          title={t('centers.map.recenter')}
        >
          <Crosshair className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warmgray-200/90 bg-surface/95 text-primary-800 shadow-md backdrop-blur-sm hover:bg-primary-50 transition-colors"
          aria-label={isFullscreen ? t('centers.map.exitFullscreen') : t('centers.map.fullscreen')}
          title={isFullscreen ? t('centers.map.exitFullscreen') : t('centers.map.fullscreen')}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

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
