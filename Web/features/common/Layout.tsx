import { Global } from "@emotion/react";
import ArrowUpwardTwoToneIcon from "@mui/icons-material/ArrowUpwardTwoTone";
import { MathJaxContext } from "better-react-mathjax";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import ParsedSEO from "../../components/ParsedSEO";
import Footer from "../../components/footer";
import SEO, { SEOProps } from "../../components/SEO";
import { SiteScriptsProps } from "../../components/SiteScripts";
import appConfigs from "../../config/appConfigs.json";
import useAppStyles from "../../hooks/useAppStyles";
import Header from "./Header";
import NavItem from "../../components/navigation/NavItem";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "";
const appConfig = appConfigs[appName] ?? {};

const SiteScripts = dynamic(() => import("../../components/SiteScripts"), { ssr: false });

export type LayoutProps = SEOProps & SiteScriptsProps & {
  dmca?: string;
  googleSiteVerification?: string;
  backgroundColor?: string;
  disableAuth?: boolean;
  disableDefaultHeader?: boolean;
  noAlternateLink?: boolean;
  addMathJax?: boolean;
  seoHeaderString?: string;
};

const styleRules = useAppStyles();

const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const {
    children,
    title,
    description = "",
    keywords = "",
    robots,
    slug,
    siteAddress,
    imageSharing: _imageSharing = "",
    imageSharingAlt = "",
    jsonLd = [],
    ua,
    ga,
    dmca,
    googleAdsClient,
    googleSiteVerification,
    backgroundColor,
    disableAuth,
    disableDefaultHeader,
    noAlternateLink,
    disableFBMessenger,
    disableAds,
    addMathJax,
    seoHeaderString
  } = props;

  const headerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [routerDomain, setRouterDomain] = useState<string>('');


  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 1000) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", toggleVisibility);
      setRouterDomain(window?.location?.origin)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      {!seoHeaderString
        ? <SEO
          title={title}
          description={description}
          keywords={keywords}
          robots={robots}
          slug={slug}
          siteAddress={siteAddress ?? routerDomain}
          jsonLd={jsonLd}
          imageSharing={_imageSharing}
          imageSharingAlt={imageSharingAlt}
          children={<>
            <meta name="dmca-site-verification" content='V2JBUldGVlBySjgyUzF2NjdocG1nVW5kaEhXbmZ6RFI4dmR0dlpseFJyST01' />
          </>}
          noAlternateLink={noAlternateLink}
        />
        : <ParsedSEO
          headerString={seoHeaderString}
          siteAddress={siteAddress}
        />}
      <SiteScripts
        ua={ua}
        ga={ga}
        disableAds={disableAds}
        disableFBMessenger={disableFBMessenger}
        googleAdsClient={googleAdsClient}
      />

      {!disableDefaultHeader && (
        <Header ref={headerRef} disableAuth={disableAuth} />
      )}
      <div id="main" style={{ marginTop: -1, backgroundColor: "#F3F7F9", minHeight: '700px' }}>
        {addMathJax ? (
          <MathJaxContext
            version={3}
            config={{
              loader: { load: ["[tex]/html"] },
              tex: {
                packages: { "[+]": ["html"] },
                inlineMath: [
                  ["$", "$"],
                  ["\\(", "\\)"],
                  ["[", "]"]
                ]
              },
              svg: {
                fontCache: "global",
              },
              options: {
                enableMenu: false,
              },
            }}
          >
            {children}
          </MathJaxContext>
        ) : (
          <>{children}</>
        )}
      </div>
      <Footer />
      <button
        id="scroll-top"
        onClick={scrollToTop}
        className={visible ? "show" : ""}
        style={{
          boxShadow: `0 0 6px 2px ${appConfig.titleColor}`,
          color: appConfig.titleColor
        }}
      >
        <ArrowUpwardTwoToneIcon />
      </button>
      <Global
        styles={`
          body {
            background-color: ${backgroundColor || "transparent"} !important;
          }
          .plain-anchor-tag {
            text-decoration: none;
            color: initial;
          }
          ${styleRules}
        `}
      />
    </>
  );
};

export default Layout;
