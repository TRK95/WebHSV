import { combineReducers } from "redux";
import appInfoSlice, { AppInfoState } from "../../../features/appInfo/appInfo.slice";
import authSlice, { AuthState } from "../../../features/auth/auth.slice";
import layoutSlice, { LayoutState } from "../../../features/common/layout.slice";
import customTestReducer, { CustomTestState } from "../../../features/custom-test/customTest.slice";
import gameSlice, { GameState } from "../../../features/study/game/game.slice";
import studyLayoutSlice, { StudyLayoutState } from "../../../features/study/studyLayout.slice";
import topicSlice, { TopicState } from "../../../features/study/topic.slice";
import wordpressSlice, { WordPressState } from "../../../features/wordpress/wordpress.slice";
import stateReducer, { StateReducer } from "./states.slice";
import clubMembersReducer, { ClubMemberState } from "./clubMemberSlice";
import categoryClubsReducer, { CategoryClubsState } from "./clubCategorySlice";
import clubsReducer, { ClubsState } from "./clubSlice";
import contactGroupReducer, { ContactGroupState } from "./contactGroupSlice";
import contactGroupMembersReducer, { ContactGroupMemberState } from "./contactGroupMemberSlice";
import categoryContactGroupReducer, { CategoryContactGroupState } from "./contactGroupCategorySlice";
import eventsReducer, { EventState } from "./eventSlice";
import newsReducer, { newsState } from "./newsSlice";
import newsCategoryReducer, { newsCategoryState } from "./newsCategorySlice";
export type AppState = {
  newsReducer: newsState,
  newsCategoryReducer: newsCategoryState;
  // appInfos: AppInfoState,
  // topicState: TopicState,
  state: StateReducer,
  authState: AuthState,
  // customTestState: CustomTestState;
  // gameState: GameState,
  // studyLayoutState: StudyLayoutState;
  // wordPressState: WordPressState;
  layoutState: LayoutState;
  clubMembersReducer: ClubMemberState;
  contactGroupMembersReducer: ContactGroupMemberState;
  categoryClubsReducer: CategoryClubsState;
  categoryContactGroupReducer: CategoryContactGroupState;
  clubsReducer: ClubsState;
  contactGroupReducer: ContactGroupState;
  eventsReducer: EventState;
}

export const rootReducers = combineReducers<AppState>({
  // appInfos: appInfoSlice,
  // topicState: topicSlice,
  state: stateReducer,
  authState: authSlice,
  clubsReducer: clubsReducer,
  clubMembersReducer: clubMembersReducer,
  categoryClubsReducer: categoryClubsReducer,
  contactGroupReducer: contactGroupReducer,
  contactGroupMembersReducer: contactGroupMembersReducer,
  categoryContactGroupReducer: categoryContactGroupReducer,
  // customTestState: customTestReducer,
  // gameState: gameSlice,
  // studyLayoutState: studyLayoutSlice,
  // wordPressState: wordpressSlice,
  layoutState: layoutSlice,
  newsReducer: newsReducer,
  eventsReducer: eventsReducer,
  newsCategoryReducer: newsCategoryReducer
});