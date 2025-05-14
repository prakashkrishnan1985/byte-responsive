import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore } from 'redux-persist';

const store = configureStore({
    reducer: rootReducer,
    // middleware is also created for us, which will allow us to take advantage of caching, invalidation, polling, and the other features of RTK Query.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }).concat(),
});

// It will enable to refetch the data on certain events, such as refetchOnFocus and refetchOnReconnect.
setupListeners(store.dispatch);
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
