import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarShow: 'responsive'
};

export const SideBarSlice = createSlice({
  name: "sidebarShow",
  initialState: initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
  },
});
