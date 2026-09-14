import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref } from "react";

const DialogTransitionDown = forwardRef((props: TransitionProps & {
  children: ReactElement<any, any>;
}, ref: Ref<unknown>) => <Slide direction="down" {...props} ref={ref} />);

export default DialogTransitionDown;