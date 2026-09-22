export const setPublicPageCache = (response: any) => {
  response?.setHeader?.(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );
};
