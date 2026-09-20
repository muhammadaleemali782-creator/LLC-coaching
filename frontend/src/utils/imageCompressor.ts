/**
 * Lightweight Client-Side Image Compressor
 * Converts any phone camera photo (4MB - 15MB) into a web-optimized,
 * high-clarity data URL (~50KB - 80KB) that saves permanently to MongoDB
 * without hitting Vercel's 4.5MB payload limit or localStorage quotas.
 */
export const compressImageFile = (file: File, maxDimension = 900, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw with smooth bicubic interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Automatically converts Google Drive sharing links into high-speed direct image URLs
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  const gdriveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}`;
  }
  return trimmed;
};
