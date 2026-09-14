import { memo, PropsWithoutRef } from "react";

const MenuBarIcon = memo((props: PropsWithoutRef<{ className?: string }>) => {
  return <svg {...{ className: props.className }} width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.318359" y="7.5" width="8.5777" height="2" rx="1" fill="#2E2E2E" />
    <rect x="0.318359" y="0.5" width="14" height="2" rx="1" fill="#2E2E2E" />
  </svg>
});

export default MenuBarIcon;