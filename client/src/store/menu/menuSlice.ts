import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Config } from '../../config.ts';
import { Category } from '../../types/app.ts';
import { redirect } from 'react-router-dom';

interface MenuState {
  menuCategories: Category[];
  totalItems: number;
  totalAmount: number;
}
export enum UpdateQuantity {
  INCREMENT = 'increment',
  DECREMENT = 'decrement',
}

const initialState: MenuState = {
  menuCategories: [],
  totalItems: 0,
  totalAmount: 0,
};

const sliceName = 'menu';

export const menuSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchMenuCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.menuCategories = action.payload;

        let totalItems = 0;
        let totalAmount = 0;
        action.payload.forEach(menuCategory => {
          menuCategory.menus.forEach(menu => {
            if (menu.orders.length) {
              totalItems += menu.orders.length;
              totalAmount += menu.orders[0].quantity * Number(menu.price);
            }
          });
        });
        state.totalItems = totalItems;
        state.totalAmount = totalAmount;
      },
    );
    builder.addCase(fetchMenuCategories.rejected, () => {
      localStorage.removeItem('token');
      redirect('/login');
    });
  },
});

export const fetchMenuCategories = createAsyncThunk(
  `${sliceName}/fetchMenuCategories`,
  async () => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = '/api/categories';
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
    });

    return await response.json();
  },
);

export default menuSlice.reducer;
