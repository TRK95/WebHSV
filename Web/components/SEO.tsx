import Head from "next/head";
import { useRouter } from "next/router";
import { PropsWithChildren, PropsWithoutRef, useMemo } from "react";
import { mapMetaRobot } from "../config/MapContraint";

export type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string | number;
  slug?: string;
  siteAddress?: string;
  imageSharing?: string;
  imageSharingAlt?: string;
  jsonLd?: string[];
  noAlternateLink?: boolean
};

const SEO = (props: PropsWithChildren<SEOProps>) => {
  const {
    title,
    description = "",
    keywords = "",
    robots,
    slug,
    siteAddress,
    imageSharing: _imageSharing = "",
    imageSharingAlt = "",
    jsonLd = [],
    children,
    noAlternateLink
  } = props;

  const host = process.env.NODE_ENV === "production" ? siteAddress || "" : "";
  const router = useRouter();

  const getCanonical = () => {
    const locales = router?.locales ?? [router?.defaultLocale ?? ""];
    if (!slug) return { canonical: null, alternates: [] };
    if (slug === "/") {
      return {
        canonical: `${host}/`,
        alternates:
          !noAlternateLink &&
            locales.length > 1
            ? locales.map((locale) => (
              <link
                key={locale}
                rel="alternate"
                href={
                  locale === router?.defaultLocale
                    ? `${host}/`
                    : `${host}/${locale}/`
                }
                hrefLang={locale}
              />
            ))
            : [],
      };
    }
    let _slug = slug;
    if (!_slug.startsWith("/")) _slug = `/${_slug}`;
    if (!_slug.endsWith("/")) _slug = `${_slug}/`;
    return {
      canonical: `${host}${_slug}`,
      alternates:
        !noAlternateLink &&
          locales.length > 1
          ? locales.map((locale) => (
            <link
              key={locale}
              rel="alternate"
              href={
                router?.locale === router?.defaultLocale
                  ? locale === router?.defaultLocale
                    ? `${host}${_slug}`
                    : `${host}/${locale}${_slug}`
                  : locale === router?.defaultLocale
                    ? `${host}${_slug.slice(3)}`
                    : `${host}${_slug}`
              }
              hrefLang={locale}
            />
          ))
          : [],
    };
  };

  const getSiteName = () => {
    try {
      return new URL(siteAddress).hostname;
    } catch (e) {
      return "";
    }
  };

  const { canonical, alternates } = getCanonical();
  const siteName = getSiteName();
  const imageSharing = useMemo(() => {
    let imageSharing = _imageSharing;
    if (imageSharing) {
      if (!imageSharing.startsWith("http")) {
        imageSharing = `${imageSharing.startsWith("/")
          ? `${host}${imageSharing}`
          : `${host}/${imageSharing}`
          }`;
      }
    }
    return imageSharing;
  }, [_imageSharing]);

  return <>
    <Head>
      <title>{title}</title>
      <link
        rel="icon"
        type="image/png"
        href={`${host}/images/huy-hieu-hoi.png`}
      />
      <link
        rel="apple-touch-icon"
        href={`${host}/images/huy-hieu-hoi.png`}
      />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="title" content={title} />
      {typeof robots !== "undefined" && (
        <meta
          name="robots"
          content={
            typeof robots === "string"
              ? `${robots}`
              : `${mapMetaRobot[robots]}`
          }
        />
      )}
      {!!canonical && (
        <>
          <link rel="canonical" href={canonical} />
          <meta property="og:url" content={canonical} />
        </>
      )}
      {alternates}
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {!!imageSharing && (
        <>
          <meta property="og:image" content={imageSharing} />
          <meta property="og:image:secure_url" content={imageSharing} />
          <meta property="og:image:alt" content={imageSharingAlt} />
        </>
      )}
      <meta property="og:site_name" content={siteName} />
      {jsonLd.map((script, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: script,
          }}
        />
      ))}
      {children}
    </Head>
  </>
}

export default SEO;