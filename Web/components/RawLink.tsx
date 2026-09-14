import { memo, PropsWithChildren } from "react";
import { Link, LinkProps } from "@mui/material";

const RawLink = memo(({ underline, color, ...props }: LinkProps) => <Link {...props} underline="none" color="inherit" />);

export default RawLink;