import { combineReducers } from '@reduxjs/toolkit';
import documentsForSpinnerSliceReducer from '../slice/documentsForSpinnerSlice';
import documentsForGeneralConfigurationReducer from '../slice/documentsForGeneralConfigurationSlice';
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
    key: 'Users',
    storage: storageSession,
};
const persistedReducer = persistReducer(persistConfig, documentsForGeneralConfigurationReducer);

const rootReducer = combineReducers({
    // Add reducers
    documentsForSpinnerSlice: documentsForSpinnerSliceReducer,
    documentsForGeneralConfigurationSlice: persistedReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
