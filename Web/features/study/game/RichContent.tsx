import { MathJax } from "better-react-mathjax";
import { PropsWithChildren } from "react";

const RichContent = (props: PropsWithChildren<{ mathJax?: boolean }>) => {
  return props.mathJax
    ? <MathJax style={{ height: "100%" }}>
      {props.children}
    </MathJax>
    : <>{props.children}</>
}

export default RichContent;