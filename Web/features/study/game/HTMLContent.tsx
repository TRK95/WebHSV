import { PropsWithoutRef } from "react";
import ReactHtmlParser, { processNodes, Transform } from "react-html-parser";
import ImageWidget from "./ImageWidget";

const transform: Transform = (node, index) => {
  if (node.type === "tag" && node.name == "img") {
    return <ImageWidget src={node.attribs?.src} key={index} width={300} />
  } else if (node.type === "tag" && node.name.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
    return <span key={index}>{processNodes(node.children, transform)}</span>
  }
}

const HTMLContent = (props: PropsWithoutRef<{ content?: string }>) => {
  return <>{ReactHtmlParser(props.content || '', {
    transform
  })}</>
}

export default HTMLContent;