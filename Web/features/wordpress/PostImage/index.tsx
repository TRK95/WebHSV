import { PropsWithoutRef, useMemo } from "react";
import { WPAttachment } from "../wordpress.model";
import "./postImage.scss";

const PostImage = (props: PropsWithoutRef<{
  media?: WPAttachment["_embedded"]["wp:featuredmedia"][0]
}>) => {
  const { media: {
    source_url: thumb,
    alt_text: alt,
    media_details: {
      width,
      height,
      sizes
    }
  } = {} } = props;
  const srcSet = useMemo(() =>
    Object.values(sizes || {})
      .filter(({ width: _width }) => _width <= width)
      .map(({ width: _width, source_url }) => `${source_url} ${_width}w`)
      .join(", "), [sizes]);
  const _sizes = useMemo(() => `(max-width: ${width}px) 100vw, ${width}px`, [width]);
  return <div className="wp-post-thumb">
    {!!thumb && <img
      width={width}
      height={height}
      src={thumb}
      alt={alt}
      srcSet={srcSet}
      sizes={_sizes}
    />}
  </div>
}

export default PostImage;