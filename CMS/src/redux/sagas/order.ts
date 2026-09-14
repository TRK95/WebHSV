import { all, fork, takeEvery } from "redux-saga/effects";
import { ActionTypes } from "../types";


function* saveNewAssignment(action: any) {
}
function* updateAssignment(action: any) {

}
function* watchOnSaveNewAssignment() {
    yield takeEvery(ActionTypes.SAVE_NEW_ASSIGNMENT, saveNewAssignment);
}
function* watchOnUpdateAssignment() {
    yield takeEvery(ActionTypes.UPDATE_ASSIGNMENT, updateAssignment);
}
export default function* assignmentSaga() {
    yield all([fork(watchOnSaveNewAssignment), fork(watchOnUpdateAssignment)]);
}