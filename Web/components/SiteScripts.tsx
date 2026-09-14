import Script from "next/script";
import { PropsWithoutRef } from "react";
import MessengerChat from "./MessengerChat";

export type SiteScriptsProps = {
  ua?: string;
  ga?: string;
  googleAdsClient?: string;
  disableFBMessenger?: boolean;
  disableAds?: boolean;
}

const SiteScripts = (props: PropsWithoutRef<SiteScriptsProps>) => {
  const {
    ua,
    ga,
    googleAdsClient,
    disableAds,
    disableFBMessenger
  } = props;

  return <>
    {!!googleAdsClient && !disableAds && (
      <Script
        strategy="afterInteractive"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsClient}`}
        crossOrigin="anonymous"
      />
    )}
    {/* UA */}
    {!!ua && (
      <>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${ua}`}
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ua}');`,
          }}
        />
      </>
    )}

    {/* GA */}
    {!!ga && (
      <>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga}');`,
          }}
        />
      </>
    )}

    {/* {!disableFBMessenger && (
      <>
        <MessengerChat />
      </>
    )} */}
  </>
}

export default SiteScripts;