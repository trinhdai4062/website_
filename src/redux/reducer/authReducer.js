import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfor:{
        access_token:'',
        id:'',
        email:'',
        refresh_token:'',
        shop:false,
        role:'',
    },
    errMessage:''
 
}

export const authCouter = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    doLoginSuccess:(state,action)=>{
        state.userInfor=action.payload
    },
    doLoginError:(state,action)=>{
        state.errMessage=action.payload
    },
    removeLogin:(state)=>{
        // state = initialState
        return initialState;
    }
    
  },
})


export const { doLoginSuccess, doLoginError, removeLogin } = authCouter.actions
export const authSelector = (state) => state.auth;
export const authReducer= authCouter.reducer;
