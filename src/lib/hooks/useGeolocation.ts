import { useState, useCallback } from 'react';

interface GeoState {
  loading: boolean;
  error: string | null;
  coords: { lat: number; lng: number } | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    loading: false,
    error: null,
    coords: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'unsupported', coords: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (err) => {
        setState({
          loading: false,
          error: err.code === 1 ? 'denied' : 'error',
          coords: null,
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, requestLocation };
}
