import { Breadcrumbs, Container, Grid, Pagination, useMediaQuery, useTheme } from "@mui/material";
import { PropsWithoutRef } from "react";
import { useSelector } from "../../app/hooks";
import RawLink from "../../components/RawLink";
import { getPurifiedContent } from "../../utils/format";
import customMaxWidthContainer from "../common/CustomMaxWidth";
import "./category.scss";
import PostImage from "./PostImage";
import PostMetaPublishDate from "./PostMetaPublishDate";
import SidePostList from "./SidePostList";
import { post_per_page } from "./wordpress.config";
import { getWPLink, WPCategory, WPPost } from "./wordpress.model";

const WPCategoryView = (props: PropsWithoutRef<{
  category: WPCategory;
  page: number;
  posts?: WPPost[];
  latestPosts?: Array<WPPost>
}>) => {
  const {
    category,
    page,
    posts = [],
    latestPosts
  } = props;

  const handleChangePage = (page: number) => {
    const link = page <= 1 ? `/${category.slug}` : `/${category.slug}/page/${page}`;
    window.location.href = link;
  }

  return <Container maxWidth={customMaxWidthContainer()} id="wp-category-view">
    <Grid container spacing={4} style={{ marginTop: 0 }}>
      <Grid item xs={12} sm={9}>
        <div id="category-main">
          <Breadcrumbs separator="-" className="site-breadcrumbs">
            <RawLink href="/">Home</RawLink>
            <RawLink href={`/${category.slug}/`}>{category.name}</RawLink>
            {page > 1 && <RawLink href={`/${category.slug}/page/${page}/`}>Page {page}</RawLink>}
          </Breadcrumbs>

          <h1 className="cat-title title-h1">{category.name}</h1>
          <div className="cat-posts-list">
            <Grid container spacing={3}>
              {posts.map((post) => {
                const postMedia = (post._embedded["wp:featuredmedia"] ?? [])[0];
                return <Grid key={post.id} item xs={12} sm={6}>
                  <RawLink href={getWPLink(post.link)}>
                    <div className="post-item" title={post.title.rendered}>
                      <div className="post-thumb">
                        {!!postMedia && <PostImage media={postMedia} />}
                      </div>
                      <h2 className="post-title dot-2" dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} />
                      <div className="post-meta">
                        <PostMetaPublishDate date={post.date_gmt} className="post-publish-date" />
                      </div>
                      <div
                        className="post-excerpt"
                        dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.excerpt.rendered) }}
                      />
                    </div>
                  </RawLink>
                </Grid>
              })}
            </Grid>
          </div>

          <div className="cat-pagination">
            <Pagination count={Math.ceil(category.count / post_per_page)} page={page} onChange={(_, page) => handleChangePage(page)} />
          </div>
        </div>
      </Grid>

      <Grid item xs={12} sm={3}>
        <div id="category-secondary">
          <div className="section-heading heading-recent-posts">Bài viết gần đây</div>
          <SidePostList posts={latestPosts} />
        </div>
      </Grid>
    </Grid>
  </Container>
}

export default WPCategoryView;