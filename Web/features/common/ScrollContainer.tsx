import { PropsWithChildren } from "react";
import { Scrollbars, ScrollbarProps } from "react-custom-scrollbars-2";

const ScrollContainer = (props: PropsWithChildren<ScrollbarProps & { className?: string; id?: string }>) => {
  const { id, className, children, ...scrollProps } = props;
  return (<Scrollbars
    {...scrollProps}
    renderView={() => <div id={id} style={{
      position: "absolute", inset: 0, overflow: "scroll", marginRight: "-17px", marginBottom: "-17px"
    }}></div>}
    className={className}
  >
    {children}
  </Scrollbars>)
}

export default ScrollContainer;