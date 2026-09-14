import Image from "next/image";
import { PropsWithoutRef } from "react";
import RawLink from "../../../components/RawLink";
import { getPurifiedContent } from "../../../utils/format";
import PostImage from "../PostImage";
import { getWPLink, WPPost } from "../wordpress.model";
import "./sidePostList.scss";

const SidePostList = (props: PropsWithoutRef<{
  posts: Array<WPPost>;
}>) => {
  return <div className="side-post-list">
    {props.posts.map((post) => {
      const postMedia = (post._embedded["wp:featuredmedia"] ?? [])[0];
      return <RawLink key={post.id} href={getWPLink(post.link)}>
        <div className="side-post-list-item">
          <div className="post-thumb">
            {!!postMedia && <PostImage media={post._embedded["wp:featuredmedia"][0]} />}
          </div>

          <div className="post-title" dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} />
        </div>
      </RawLink>
    })}
  </div>
}

export default SidePostList;