import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice.ts';
import { useDispatch } from 'react-redux';
import authReducer from './auth/authSlice.ts';
import menuReducer from './menu/menuSlice.ts';
import transactionReducer from './payment/trxSlice.ts';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    menu: menuReducer,
    transactions: transactionReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
