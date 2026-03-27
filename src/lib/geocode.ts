/**
 * Northern Connect — Geocoding
 * Converts a street address to lat/lng using OpenStreetMap Nominatim (free, no API key)
 * Rate limit: 1 request/second — fine for user-triggered form submits
 */

export interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Geocode an address within Prince George, BC, Canada.
 * Always appends ", Prince George, BC, Canada" to improve accuracy.
 */
export async function geocodeAddress(
  address: string
): Promise<GeoResult | null> {
  const query = encodeURIComponent(
    `${address}, Prince George, BC, Canada`
  );

  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=1`;

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim requires a User-Agent identifying your app
        'User-Agent': 'NorthernConnect/1.0 (northernconnect.ca)',
      },
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch a photo URL for a business by trying to extract
 * the og:image from their website. Server-side use only.
 * Returns null if unavailable.
 */
export async function fetchOgImage(
  websiteUrl: string
): Promise<string | null> {
  if (!websiteUrl) return null;

  try {
    const res = await fetch(websiteUrl, { signal: AbortSignal.timeout(4000) });
    const html = await res.text();

    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );

    return match ? match[1] : null;
  } catch {
    return null;
  }
}
