/**
 * Northern Connect — Location Utilities
 * Distance calculation, walking/driving time, and Maps deep-link
 */

// Prince George city centre — fallback when user denies location permission
export const PG_CENTRE = { lat: 53.9171, lng: -122.7497 };

// ─────────────────────────────────────────────
// Haversine distance between two coordinates
// Returns distance in kilometres
// ─────────────────────────────────────────────
export function getDistanceKm(
  userLat: number,
  userLng: number,
  orgLat: number,
  orgLng: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(orgLat - userLat);
  const dLng = toRad(orgLng - userLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLat)) *
      Math.cos(toRad(orgLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─────────────────────────────────────────────
// Walking time (5 km/h average pace)
// ─────────────────────────────────────────────
export function getWalkingTime(distanceKm: number): string {
  const minutes = Math.round((distanceKm / 5) * 60);
  if (minutes < 1) return '< 1 min walk';
  if (minutes < 60) return `~${minutes} min walk`;
  return `~${Math.round(minutes / 60)} hr walk`;
}

// ─────────────────────────────────────────────
// Driving time (40 km/h city average for PG)
// ─────────────────────────────────────────────
export function getDrivingTime(distanceKm: number): string {
  const minutes = Math.round((distanceKm / 40) * 60);
  if (minutes < 1) return '< 1 min drive';
  return `~${minutes} min drive`;
}

// ─────────────────────────────────────────────
// Combined display string
//   ≤ 2 km  →  "1.2 km · ~14 min walk"
//   > 2 km  →  "4.5 km · ~7 min drive"
// ─────────────────────────────────────────────
export function formatDistance(distanceKm: number): string {
  const kmLabel =
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} km`;

  const timeLabel =
    distanceKm <= 2
      ? getWalkingTime(distanceKm)
      : getDrivingTime(distanceKm);

  return `${kmLabel} · ${timeLabel}`;
}

// ─────────────────────────────────────────────
// "Open in Maps" deep-link
//   iOS  → Apple Maps (native app opens)
//   else → Google Maps
// ─────────────────────────────────────────────
export function getMapsUrl(
  lat: number,
  lng: number,
  label?: string
): string {
  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
    return `maps://?q=${q}&ll=${lat},${lng}`;
  }

  const dest = label
    ? `${encodeURIComponent(label)}&destination=${lat},${lng}`
    : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

// ─────────────────────────────────────────────
// Get user's current location
// Falls back to PG city centre if denied or unavailable
// ─────────────────────────────────────────────
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(PG_CENTRE);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(PG_CENTRE), // denied or error → PG centre
      { timeout: 5000 }
    );
  });
}
