import { configureStore } from '@reduxjs/toolkit'
import  {authReducer}  from './reducer/authReducer'
import { cartReducer } from './reducer/shopReducer';
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
})

export default store;