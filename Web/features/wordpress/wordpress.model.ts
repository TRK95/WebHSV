import _ from "lodash";

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
}

export interface WPAttachment extends WPPost {
  alt_text: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    sizes: {
      [size: string]: {
        width: number;
        height: number;
        source_url: string;
      }
    }
  }
}

export interface WPPost {
  id: number;
  date_gmt: string | null;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private",
  type: string,
  link: string;
  categories: Array<number>;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded: {
    "wp:featuredmedia": Array<WPAttachment>
  }
}

export const pickPost = (args: { post: WPPost, withContent?: boolean }) => {
  const { post, withContent = false } = args;
  const keys = ["id", "date_gmt", "slug", "status", "type", "link", "title", "excerpt", "_embedded", "categories"];
  if (withContent) keys.push("content");
  return _.pick<WPPost>(post, keys) as WPPost;
}

export const getWPLink = (link: string) => {
  return link.startsWith("http") && process.env.NODE_ENV !== "production"
    ? link.replace(/(https?:\/\/)(.*?)(\/.*)/g, '$3')
    : link
}