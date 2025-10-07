import { createSlice } from "@reduxjs/toolkit";

const initialState =  {loginVal : null};

export const LoginValuesSlice = createSlice({
    name : "submitStore",
    initialState ,
    reducers: {
        submitVals: (state , action)=>{
            state.loginVal = action.payload;
        }
    }
})

export const {submitVals} = LoginValuesSlice.actions;

export default LoginValuesSlice.reducer;
