import { AnyAction } from 'redux';
// import { applyMiddleware, createStore, Store, } from 'redux';
// import createSagaMiddleware, { SagaMiddleware, Task } from 'redux-saga';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
// import { rootSaga } from './sagas'
import rootReducers from './reducer';
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";


// export interface SagaStore extends Store {
//     sagaTask?: Task;
// }
// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: []
// }
// const persistedReducer: any = persistReducer(persistConfig, rootReducers)

// const bindMiddleware = (middleware: Array<SagaMiddleware>) => {
//     return applyMiddleware(...middleware)
// }

// const makeStore = () => {
//     const sagaMiddleware = createSagaMiddleware();
//     const store = createStore(persistedReducer, bindMiddleware([sagaMiddleware]));
//     const persistor = persistStore(store);
//     sagaMiddleware.run(rootSaga);
//     return { store, persistor }
// }

const reducer = (state: ReturnType<typeof rootReducers> | undefined, action: AnyAction) => {
    return rootReducers(state, action);
};

export const store: EnhancedStore<ReturnType<typeof rootReducers>, any> = configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false
        });
    }
});

// const makeStore = () => {
//     return store;
// };



// export { makeStore };