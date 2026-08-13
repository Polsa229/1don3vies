/** Build a Google Maps directions URL to a destination. */
export function directionsUrl(
  lat: number,
  lng: number,
  origin?: { lat: number; lng: number } | null,
) {
  const dest = `${lat},${lng}`;
  if (origin) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}
