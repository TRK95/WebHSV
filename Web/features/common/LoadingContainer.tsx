import { Backdrop, CircularProgress } from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";

const LoadingContainer = (props: PropsWithChildren<{ loading?: boolean; useDelay?: boolean }>) => {
  const [isDelay, setDelay] = useState(false);
  const { loading = false, useDelay = false, children } = props;

  useEffect(() => {
    if (useDelay) {
      if (!props.loading) {
        setDelay(true);
        setTimeout(() => {
          setDelay(false);
        }, 500);
      } else {
        setDelay(false);
      }
    }
  }, [loading, useDelay]);

  return isDelay ? (<Backdrop
    sx={{ color: "#fff", background: "#ffffffcc" }}
    open={true}
    transitionDuration={500}
  >
    <CircularProgress color="inherit" />
  </Backdrop>) : <>{children}</>
}

export default LoadingContainer;