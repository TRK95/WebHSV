import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { setCurrentState, setOpenSelectStateDialog, stateSlugKey } from "../../app/redux/reducers/states.slice";
import { StateData } from "../../types/StateData";
import { chunkArr } from "../../utils/api/common";
import DialogTransitionDown from "../DialogTransitionDown";
import "./selectStateDialog.scss";

const SelectStateDialog = () => {
  const openSelectStateDialog = useSelector((state) => state.state.openSelectStateDialog);
  const statesList = useSelector((state) => state.state.statesList);
  const onSelectStateCallback = useSelector((state) => state.state.onSelectStateCallback);
  const currentState = useSelector((state) => state.state.currentState);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();

  const stateChunks = useMemo(() => {
    return chunkArr(statesList, isMobileUI ? 1 : 4);
  }, [statesList.length, isMobileUI]);

  const onCloseDialog = () => {
    dispatch(setOpenSelectStateDialog({ open: false }));
  }

  const handleSelectState = (state: StateData) => {
    localStorage.setItem(stateSlugKey, state.slug);
    dispatch(setCurrentState(state));
    onCloseDialog();
    if (!!onSelectStateCallback) {
      onSelectStateCallback(state.slug);
    } else {
      router.push(`/${state.slug}`);
    }
  }

  return <Dialog
    open={openSelectStateDialog && !!statesList.length}
    onClose={onCloseDialog}
    TransitionComponent={DialogTransitionDown}
    fullWidth
    maxWidth="lg"
    PaperProps={{ id: "select-state-dialog" }}
  >
    <DialogTitle className="title-container">
      Select your state
      <IconButton
        className="close-button"
        onClick={onCloseDialog}>
        <Close color="inherit" fontSize="large" />
      </IconButton>
    </DialogTitle>

    <DialogContent classes={{
      root: "main-content"
    }}>
      <Grid container spacing={4}>
        {stateChunks.map((col, i) => {
          return <Grid key={i} item xs={12} md={3}>
            {col.map((state, stateIdx) => {
              const isSelected = state.slug === currentState?.slug;
              return <div key={stateIdx}
                className={classNames(
                  "state-item",
                  isSelected ? "selected" : ""
                )}
                onClick={() => handleSelectState(state)}
              >
                {state.name}
              </div>
            })}
          </Grid>
        })}
      </Grid>
    </DialogContent>
  </Dialog>
}

export default SelectStateDialog;