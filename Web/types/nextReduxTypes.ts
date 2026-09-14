import { GetStaticPropsContext } from "next";
import { Action, CombinedState, Store } from "redux";
import { AppState } from "../app/redux/reducers";

export type GetStaticPropsReduxContext = GetStaticPropsContext & { store: Store<CombinedState<AppState>> }

export type HydrateAppAction = Action<"__NEXT_REDUX_WRAPPER_HYDRATE__"> & { payload?: AppState }