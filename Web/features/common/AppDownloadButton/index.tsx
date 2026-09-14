import classNames from "classnames";
import { CSSProperties, memo, PropsWithoutRef, useMemo, useState } from "react";
import AppStoreBadgeIcon from "./AppStoreBadgeIcon";
import AppStoreIcon from "./AppStoreIcon";
import CHPlayIcon from "./CHPlayIcon";
import GooglePlayBadgeIcon from "./GooglePlayBadgeIcon";
import "./style.scss";

const AppDownloadButton = (props: PropsWithoutRef<{
  link?: string; source: "chplay" | "appstore"; className?: string; linkStyle?: CSSProperties;
  color?: string; hoverColor?: string;
  background?: string; hoverBackround?: string;
  border?: string; hoverBorder?: string;
}>) => {
  const {
    link, source, className, linkStyle,
    color, hoverColor,
    background, hoverBackround,
    border, hoverBorder
  } = props;
  const [hover, setHover] = useState(false);
  const sendDownloadAnalytics = () => {
    if (gtag) {
      gtag("event", "click", {
        event_category: "download_app",
        event_label: source === "chplay" ? "download_app_android" : "download_app_ios"
      });
    }
    // if (window['ga']) {
    //   window['ga']("send", "event", "Download", "click", source === "chplay" ? "android" : "apple");
    // } else if (window['gtag']) {
    //   window['gtag']("event", "click", {
    //     "event_category": "Download",
    //     "event_label": source === "chplay" ? "android" : "apple"
    //   });
    // }
  }
  const {
    stroke,
    fill,
    contentFill
  } = useMemo(() => ({
    stroke: hover ? hoverBorder : border,
    fill: hover ? hoverBackround : background,
    contentFill: hover ? hoverColor : color
  }), [hover]);

  return (<a href={link} className="plain-anchor-tag" style={{ ...linkStyle }} onClick={(event) => {
    event.preventDefault();
    sendDownloadAnalytics();
    window.open(link, "_blank");
  }}>
    <div className={classNames("app-download-btn", className)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {source === "chplay"
        ? <GooglePlayBadgeIcon stroke={stroke} fill={fill} contentFill={contentFill} />
        : <AppStoreBadgeIcon stroke={stroke} fill={fill} contentFill={contentFill} />
      }
    </div>
  </a>)
}

export default memo(AppDownloadButton);