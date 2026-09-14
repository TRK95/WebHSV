import { useRouter } from "next/router";
import { useDispatch, useSelector } from "../app/hooks"
import { setOpenSelectStateDialog } from "../app/redux/reducers/states.slice";

const useCheckState = () => {
  const currentState = useSelector((state) => state.state.currentState);
  const dispatch = useDispatch();
  const router = useRouter();

  const checkState = (args: {
    practiceSlug?: string;
    onClickSamePath?: () => void;
    onSelectCallback?: (stateSlug: string) => void;
    action?: () => void;
  } = { practiceSlug: '', onClickSamePath: undefined, onSelectCallback: undefined, action: undefined }) => {
    const { practiceSlug, onClickSamePath = () => { }, onSelectCallback, action } = args;
    if (!currentState) {
      dispatch(setOpenSelectStateDialog({ open: true, onSelect: onSelectCallback }));
    } else {
      if (router.query.state === currentState.slug) {
        // CDL Logic
        if (!!onClickSamePath) onClickSamePath();
        else if (!!action) action();
      } else {
        if (!!action) action();
        else {
          // CDL Logic
          router.push({
            pathname: currentState.slug,
            hash: practiceSlug
          });
        }
      }
    }
  }
  return {
    checkState,
    currentState
  }
}


export default useCheckState;