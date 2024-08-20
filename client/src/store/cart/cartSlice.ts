import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Cart } from '../../types/checkout.ts';
import { Config } from '../../config.ts';
import { errorAlert } from '../../helpers/alert.ts';

interface CartState {
  data: Cart | null;
  tax: number;
  subTotal: number;
  total: number;
}

const initialState: CartState = {
  data: null,
  tax: 0,
  subTotal: 0,
  total: 0,
};

const sliceName = 'cart';

export const counterSlice = createSlice({
  // name of the slice
  name: sliceName,
  // initial state of the slice
  initialState,
  // reducers to handle actions
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.data = action.payload;
      state.subTotal = (action.payload as Cart).orders.reduce((acc, order) => {
        return acc + parseInt(order.menu.price) * order.quantity;
      }, 0);
      state.tax = (state.subTotal * Number(state.data?.taxPer || 0)) / 100;
      state.total = state.subTotal + state.tax;
    });
  },
});

export const fetchCart = createAsyncThunk(
  `${sliceName}/fetchCart`,
  async () => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = `/api/carts/active`;

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
    });

    return await response.json();
  },
);

export const updateOrderQuantity = createAsyncThunk(
  `${sliceName}/updateQuantity`,
  async (params: { id: number; type: 'increment' | 'decrement' }) => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = `/api/orders/${params.id}/quantity`;

    const response = await fetch(url.toString(), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
      body: JSON.stringify({
        type: params.type,
      }),
    });

    return await response.json();
  },
);

export const addToCart = createAsyncThunk(
  `${sliceName}/addToCart`,
  async (menuId: number) => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = '/api/orders';

    const res = await fetch(url.toString(), {
      method: Config.HTTP_METHODS.POST,
      headers: {
        Authorization: `Bearer ${Config.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        menuId,
      }),
    });

    if (!res.ok) {
      return errorAlert('Failed to add to cart');
    }
  },
);

export default counterSlice.reducer;
