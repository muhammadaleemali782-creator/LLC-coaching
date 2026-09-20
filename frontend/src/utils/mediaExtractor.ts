import { VideoPlatform } from '../types';
import { normalizeImageUrl } from './imageCompressor';

/**
 * Automatically detects platform from any video or social URL
 */
export const detectPlatform = (url: string): VideoPlatform => {
  if (!url) return 'youtube';
  const lower = url.toLowerCase().trim();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.me')) return 'facebook';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  return 'youtube';
};

/**
 * Extracts unique video or post ID from URL based on platform
 */
export const extractVideoId = (url: string, platform?: VideoPlatform): string => {
  if (!url) return '';
  const resolvedPlatform = platform || detectPlatform(url);
  const trimmed = url.trim();

  if (resolvedPlatform === 'youtube') {
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/))([\w-]{11})/i);
    return match ? match[1] : (trimmed.length === 11 ? trimmed : '');
  }

  if (resolvedPlatform === 'instagram') {
    const match = trimmed.match(/(?:instagram\.com\/(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+))/i);
    if (match && match[1]) return match[1];
    const cleanUrl = trimmed.split('?')[0].replace(/\/+$/, '');
    return cleanUrl.split('/').pop() || '';
  }

  if (resolvedPlatform === 'twitter') {
    const match = trimmed.match(/status\/(\d+)/i);
    return match ? match[1] : '';
  }

  if (resolvedPlatform === 'facebook') {
    const match = trimmed.match(/(?:videos\/|watch\/\?v=|story\.php\?story_fbid=)(\d+)/i);
    return match ? match[1] : 'fb-video';
  }

  return '';
};

/**
 * Extracts immediate thumbnail preview image for any video link (0ms latency)
 */
export const extractThumbnailFromUrl = (url: string, platform?: VideoPlatform): string => {
  if (!url) return '';
  const trimmed = url.trim();

  // If already an image URL or data URL
  if (trimmed.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(trimmed)) {
    return normalizeImageUrl(trimmed);
  }

  // Google Drive link
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    return normalizeImageUrl(trimmed);
  }

  const resolvedPlatform = platform || detectPlatform(trimmed);
  const videoId = extractVideoId(trimmed, resolvedPlatform);

  if (resolvedPlatform === 'youtube') {
    const id = videoId || 'kJQP7kiw5Fk';
    return "https://img.youtube.com/vi/" + id + "/hqdefault.jpg";
  }

  if (resolvedPlatform === 'instagram') {
    if (videoId) {
      return "https://images.weserv.nl/?url=" + encodeURIComponent("https://www.instagram.com/p/" + videoId + "/media/?size=l");
    }
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';
  }

  if (resolvedPlatform === 'facebook') {
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
  }

  if (resolvedPlatform === 'twitter') {
    return 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&auto=format&fit=crop&q=80';
  }

  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
};

/**
 * Async metadata fetcher with strict timeout to auto-populate title & thumbnail
 */
export const fetchMediaDetails = async (
  url: string
): Promise<{ title: string; thumbnail: string; platform: VideoPlatform; videoId: string }> => {
  const platform = detectPlatform(url);
  const videoId = extractVideoId(url, platform);
  const fastThumbnail = extractThumbnailFromUrl(url, platform);

  const fallbackResult = {
    title: '',
    thumbnail: fastThumbnail,
    platform,
    videoId
  };

  if (!url || !url.startsWith('http')) {
    return fallbackResult;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    if (platform === 'youtube') {
      const oembedUrl = "https://noembed.com/embed?url=" + encodeURIComponent(url);
      const res = await fetch(oembedUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          title: data.title || '',
          thumbnail: data.thumbnail_url || fastThumbnail,
          platform,
          videoId
        };
      }
    } else if (platform === 'twitter') {
      const oembedUrl = "https://publish.twitter.com/oembed?url=" + encodeURIComponent(url);
      const res = await fetch(oembedUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          title: data.author_name ? "Post by " + data.author_name : '',
          thumbnail: fastThumbnail,
          platform,
          videoId
        };
      }
    }
  } catch (err) {
    // Safely fallback
  }

  return fallbackResult;
};
