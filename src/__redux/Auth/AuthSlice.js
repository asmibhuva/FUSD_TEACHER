import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading : false
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsUserSignedIn: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});
