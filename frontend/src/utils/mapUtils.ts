/**
 * Google Maps Utility
 * Intelligently converts iframe embed tags, custom URLs, place names, or addresses
 * into secure, cross-browser embeddable iframe URLs.
 */

export const getGoogleMapEmbedUrl = (input?: string, fallbackAddress?: string): string => {
  const raw = (input || '').trim();

  // 1. If user pasted an iframe tag: <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>
  const iframeMatch = raw.match(/src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  // 2. If user pasted a direct Google Maps embed URL
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    if (raw.includes('/maps/embed') || (raw.includes('maps.google.') && raw.includes('output=embed'))) {
      return raw;
    }
  }

  // 3. If user provided a custom location query, coordinates, or address
  const query = raw || (fallbackAddress || '').trim() || 'Palahipatti, Varanasi, Sindhora Road Near Union Bank';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

/**
 * Returns a direct directions / view URL for students to open in Google Maps app
 */
export const getGoogleMapAppUrl = (input?: string, fallbackAddress?: string): string => {
  const raw = (input || '').trim();

  if (raw.includes('<iframe') || raw.includes('/maps/embed')) {
    const fallback = (fallbackAddress || '').trim() || 'LCC Coaching Palahipatti Varanasi';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallback)}`;
  }

  const query = raw || (fallbackAddress || '').trim() || 'LCC Coaching Palahipatti Varanasi';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
