import categoryClubsReducer, { CategoryClubsState } from '@/redux/reducer/clubCategorySlice';
import { AnyAction, combineReducers } from 'redux';
import clubMembersReducer, { ClubMemberState } from './clubMemberSlice';
import clubsReducer, { ClubsState } from './clubSlice';
import eventsReducer, { EventState } from './eventSlice';
import initialReducer, { InitialSliceState } from './initial.slice';
import newsCategoryReducer, { newsCategoryState } from './newsCategorySlice';
import newsReducer, { newsState } from './newsSlice';
import orderSliceReducer, { OrderSliceState } from './order.slice';
import clubFeatureChildsReducer, { ClubFeatureChildState } from './clubFeatureChildSlice';
import userInfoReducer, { UserInfoState } from './userInfoSlice';
import clubFeatureDetailsReducer, { ClubFeatureDetailState } from './clubFeatureDetailSlice';

export interface AppState {
    initialReducer: InitialSliceState;
    orderReducer: OrderSliceState;
    categoryClubsReducer: CategoryClubsState;
    clubsReducer: ClubsState;
    newsCategoryReducer: newsCategoryState;
    newsReducer: newsState;
    eventsReducer: EventState;
    clubMembersReducer: ClubMemberState;
    clubFeatureChildsReducer: ClubFeatureChildState;
    clubFeatureDetailsReducer: ClubFeatureDetailState;
    userInfoReducer: UserInfoState;
}

const rootReducers = combineReducers<AppState, AnyAction>({
    initialReducer: initialReducer,
    orderReducer: orderSliceReducer,
    categoryClubsReducer: categoryClubsReducer,
    clubsReducer: clubsReducer,
    newsCategoryReducer: newsCategoryReducer,
    newsReducer: newsReducer,
    eventsReducer: eventsReducer,
    clubMembersReducer: clubMembersReducer,
    clubFeatureChildsReducer: clubFeatureChildsReducer,
    clubFeatureDetailsReducer: clubFeatureDetailsReducer,
    userInfoReducer: userInfoReducer
});
export default rootReducers;
