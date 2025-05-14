import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { spinnerState: boolean; envList: any; testSuiteList: any } = {
    spinnerState: false,
    envList: [],
    testSuiteList: [],
};

export const documentsForSpinnerSlice = createSlice({
    name: 'documentForSpinner',
    initialState,
    reducers: {
        setSpinner: (state, action: PayloadAction<boolean>) => {
            state.spinnerState = action.payload;
        },
        setEnvList: (state, action: PayloadAction<any>) => {
            state.envList = action.payload;
        },
        setTestSuiteList: (state, action: PayloadAction<any>) => {
            state.testSuiteList = action.payload;
        },
    },
});

export const { setSpinner, setEnvList, setTestSuiteList } = documentsForSpinnerSlice.actions;
export default documentsForSpinnerSlice.reducer;
