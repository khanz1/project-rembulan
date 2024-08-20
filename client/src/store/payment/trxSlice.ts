import { Config } from '../../config.ts';
import { Transaction } from '../../types/history.ts';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrxState {
  transactions: Transaction[];
  detail: {
    data: Transaction | null;
    total: number;
    tax: number;
    subTotal: number;
  };
}

const initialState: TrxState = {
  transactions: [],
  detail: {
    data: null,
    total: 0,
    tax: 0,
    subTotal: 0,
  },
};

const sliceName = 'transaction';

export const paymentSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      fetchTransactions.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        state.transactions = action.payload;
      },
    );

    builder.addCase(
      fetchTransactionById.fulfilled,
      (state, action: PayloadAction<Transaction>) => {
        const taxPer = Number(action.payload?.cart.taxPer || 0);
        const trxAmount = Number(action.payload?.amount || 0);

        state.detail.data = action.payload;
        state.detail.subTotal = trxAmount;
        state.detail.tax = (trxAmount * taxPer) / 100;
        state.detail.total = trxAmount + state.detail.tax;
      },
    );
  },
});

export const fetchTransactions = createAsyncThunk(
  `${sliceName}/fetchTransactions`,
  async () => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = '/api/payments/history';

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
    });

    const { data } = await response.json();
    return data;
  },
);

export const fetchTransactionById = createAsyncThunk(
  `${sliceName}/fetchTransactionById`,
  async (id: number) => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = `/api/payments/history/${id}`;

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
    });

    const data = await response.json();
    return data.data;
  },
);

export const getTransactionToken = (amount: number, cartId: number) => {
  return async () => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = '/api/payments/token';

    const response = await fetch(url.toString(), {
      method: Config.HTTP_METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
      body: JSON.stringify({
        amount,
        cartId,
      }),
    });

    return await response.json();
  };
};

export const updatePaymentStatus = () => {
  return async () => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = '/api/payments/success';
    await fetch(url.toString(), {
      method: Config.HTTP_METHODS.PUT,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
    });
  };
};

export default paymentSlice.reducer;
