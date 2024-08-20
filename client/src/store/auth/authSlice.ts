import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Config } from '../../config.ts';
import { errorAlert } from '../../helpers/alert.ts';

const sliceName = 'auth';

export const authSlice = createSlice({
  // name of the slice
  name: sliceName,
  // initial state of the slice
  initialState: null,
  // reducers to handle actions
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      loginGoogle.fulfilled,
      (_, action: PayloadAction<{ accessToken: string }>) => {
        localStorage.setItem('token', action.payload.accessToken);
      },
    );
  },
});

export const loginGoogle = createAsyncThunk(
  `${sliceName}/loginGoogle`,
  async (credential: string) => {
    const url = new URL(Config.SERVER_BASE_URL);
    url.pathname = '/api/auth/login/google';

    const res = await fetch(url.toString(), {
      method: Config.HTTP_METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.getAccessToken()}`,
      },
      body: JSON.stringify({
        googleToken: credential,
      }),
    });

    if (!res.ok) {
      return errorAlert('Failed to fetch');
    }

    return await res.json();
  },
);

export default authSlice.reducer;
