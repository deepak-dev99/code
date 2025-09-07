import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  access_token: null,
  refresh_token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;
      state.user = user;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authData');
    },

        initializeAuth: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;
      state.user = user;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.isAuthenticated = true;
    },


  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;