import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DocumentsForGeneralConfigurationState = {
    serviceNameState: string;
    typeOfuser: string;
   
};

const initialState: DocumentsForGeneralConfigurationState = {
    serviceNameState: 'Home',
    typeOfuser: 'Developer',
   
};

export const documentsForGeneralConfigurationSlice = createSlice({
    name: 'documentsForGeneralConfiguration',
    initialState,
    reducers: {
        setsServiceNameState: (state:any, action: PayloadAction<string>) => {
            state.serviceNameState = action.payload;
        },
        setTypeOfUser: (state:any, action: PayloadAction<string>) => {  
            state.typeOfuser = action.payload;
        }
       
    },
});

export const {
    setsServiceNameState,
    setTypeOfUser,
} = documentsForGeneralConfigurationSlice.actions;
export default documentsForGeneralConfigurationSlice.reducer;
