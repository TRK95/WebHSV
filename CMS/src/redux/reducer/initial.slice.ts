import { Reducer } from "redux";

export type InitialSliceState = {
    apiPort: string;
    token: string;
    apiPortOrder: string;
};

const initialState: InitialSliceState = {
    apiPort: process.env.API_ENDPOINT ?? '',
    token: process.env.TOKEN ?? '',
    apiPortOrder: process.env.API_ENDPOINT_MAIL ?? '',
}
const initialReducer: Reducer<any, any> = (state: any = initialState, action: any): any => {
    return state;
}

export default initialReducer;
