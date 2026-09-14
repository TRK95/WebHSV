import { memo, PropsWithChildren } from "react";
import Link, { LinkProps } from "next/link";

const NextLink = memo((props: PropsWithChildren<LinkProps & { name?: string, aProps?: any }>) => {
  const { children, name, aProps, ...linkProps } = props;
  if (name === "TOEIC" || name === "IELTS") {
    return <a href={linkProps.href as string} target="_blank" rel="nofollow" style={{ textDecoration: "none", color: "inherit" }}>
      {children}
    </a>
  }
  if (aProps) {
    return <Link {...linkProps} passHref>
      <a {...aProps} style={{ textDecoration: "none", color: "inherit" }}>
        {children}
      </a>
    </Link>
  }
  return <Link {...linkProps} passHref>
    <a style={{ textDecoration: "none", color: "inherit" }}>
      {children}
    </a>
  </Link>
});

export default NextLink;