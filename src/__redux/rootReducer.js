import { combineReducers } from "@reduxjs/toolkit";
import { AuthSlice } from "./Auth/AuthSlice";
import { ChartDataSlice } from "./chartData/ChartData";
import { SideBarSlice } from "./SideBar/SideBarSlice";

export const rootReducer = combineReducers({
  auth: AuthSlice.reducer,
  sidebarShow: SideBarSlice.reducer,
  chartData: ChartDataSlice.reducer,
});