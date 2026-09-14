import { memo, PropsWithoutRef } from "react";

const PaletteStatIcon = memo((props: PropsWithoutRef<{ fill?: string }>) => {
  return <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.5" width="10" height="10" rx="3" fill={props.fill || "#4CAF50"} />
  </svg>
});

export default PaletteStatIcon;