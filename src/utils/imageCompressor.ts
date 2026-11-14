/**
 * Compresses and normalizes an image File, Blob, or Video frame into a clean JPEG Data URL
 * suitable for fast AI Vision analysis on mobile & desktop.
 */
export async function compressImageFileToDataUrl(
  file: File,
  maxDimension = 1024,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossible de lire le fichier image."));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width >= height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        // Fallback: send original Data URL if browser couldn't draw it onto canvas
        resolve(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function captureVideoFrameToDataUrl(
  video: HTMLVideoElement,
  maxDimension = 1024,
  quality = 0.86
): string | null {
  if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
    return null;
  }

  let width = video.videoWidth;
  let height = video.videoHeight;
  if (width > maxDimension || height > maxDimension) {
    if (width >= height) {
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
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
}
