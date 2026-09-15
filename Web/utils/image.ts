export const getDisplayImage = (src?: string, fallback = "/images/huy-hieu-hoi.png") => {
  if (!src) return fallback;
  return src.startsWith("http") || src.startsWith("/") ? src : fallback;
};
