import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DocumentsForGeneralConfigurationState = {
    serviceNameState: string;
   
};

const initialState: DocumentsForGeneralConfigurationState = {
    serviceNameState: 'Home',
   
};

export const documentsForGeneralConfigurationSlice = createSlice({
    name: 'documentsForGeneralConfiguration',
    initialState,
    reducers: {
        setsServiceNameState: (state:any, action: PayloadAction<string>) => {
            state.serviceNameState = action.payload;
        },
       
    },
});

export const {
    setsServiceNameState,
} = documentsForGeneralConfigurationSlice.actions;
export default documentsForGeneralConfigurationSlice.reducer;
