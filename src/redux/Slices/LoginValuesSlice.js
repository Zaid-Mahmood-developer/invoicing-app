import { createSlice } from "@reduxjs/toolkit";

const initialState =  {loginVal : null , signupVal : null} ;

export const LoginValuesSlice = createSlice({
    name : "submitStore",
    initialState ,
    reducers: {
        submitVals: (state , action)=>{
            state.loginVal = action.payload;
        },
        signupVals: (state , action)=>{
            state.signupVal = action.payload;
        }
    }
})

export const {submitVals , signupVals} = LoginValuesSlice.actions;

export default LoginValuesSlice.reducer;
