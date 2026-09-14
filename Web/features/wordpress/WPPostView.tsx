import { Breadcrumbs, Container, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { PropsWithoutRef, useState } from "react";
import { useSelector } from "../../app/hooks";
import RawLink from "../../components/RawLink";
import { getPurifiedContent } from "../../utils/format";
import customMaxWidthContainer from "../common/CustomMaxWidth";
import "./post.scss";
import PostMetaPublishDate from "./PostMetaPublishDate";
import FacebookShareIcon from "./social-icons/FacebookShareIcon";
import LinkedInShareIcon from "./social-icons/LinkedInShareIcon";
import PinterestShareIcon from "./social-icons/PinterestShareIcon";
import TumblrShareIcon from "./social-icons/TumblrShareIcon";
import TwitterShareIcon from "./social-icons/TwitterShareIcon";
import TableOfContents from "./TableOfContents";
import useHeadingsData from "./useHeadingsData";
import { getWPLink, WPCategory, WPPost } from "./wordpress.model";

const WPPostView = (props: PropsWithoutRef<{
  category?: WPCategory;
  post: WPPost;
}>) => {
  const {
    category,
    post
  } = props;

  const latestPosts = useSelector((state) => state.wordPressState.latestPosts);
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null)

  const { headings } = useHeadingsData({ rootElement: contentRef });
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"))

  return <Container maxWidth={customMaxWidthContainer()} id="wp-post-view">
    <div className={classNames("post-content-main", isTabletUI ? "tablet" : "")}>
      {!isTabletUI && <div className="post-content-main-left">
        <TableOfContents headings={headings} className="post-toc-wrap" />
      </div>}

      <div className="post-content-main-view">
        <Breadcrumbs separator="-" className="site-breadcrumbs">
          <RawLink href="/">Home</RawLink>
          {!!category && <RawLink href={`/${category.slug}`}>{category.name}</RawLink>}
          <RawLink href={getWPLink(post.link)}><span dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} /></RawLink>
        </Breadcrumbs>
        <h1 className="post-title" dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} />
        <div className="post-meta">
          <PostMetaPublishDate date={post.date_gmt} />
        </div>

        {isTabletUI && <TableOfContents headings={headings} className="post-toc-wrap-tablet" />}

        <div className="post-content"
          ref={setContentRef}
          dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.content.rendered) }}
        />
        <div id="social-share">
          <FacebookShareIcon url={post.link} />
          <PinterestShareIcon url={post.link} media={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url} title={post.title.rendered} />
          <LinkedInShareIcon url={post.link} title={post.title.rendered} />
          <TwitterShareIcon url={post.link} title={post.title.rendered} />
          <TumblrShareIcon url={post.link} />
        </div>
      </div>
    </div>
  </Container >
}

export default WPPostView;