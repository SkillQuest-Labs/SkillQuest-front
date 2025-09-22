// src/shared/services/cloudinary.service.ts
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`;

export const getOptimizedVideoUrl = (
  publicId: string,
  options: {
    quality?: string;
    format?: string;
    width?: string;
    height?: string;
  } = {},
) => {
  const { quality = "q_auto", format = "f_auto", width = "w_auto", height = "h_auto" } = options;

  return `${CLOUDINARY_BASE_URL}/${quality},${format},${width},${height}/${publicId}`;
};

export const getThumbnailUrl = (publicId: string, width: number = 300) => {
  return `${CLOUDINARY_BASE_URL}/q_auto,f_auto,w_${width}/${publicId}`;
};
