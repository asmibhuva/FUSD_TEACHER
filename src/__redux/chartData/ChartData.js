import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  chartData : null,
  chartFilterData : {
    fromDate:moment().subtract(6, "days").toDate(),
    toDate:moment().toDate(),
  },
  selectedStudent:null,
};

export const ChartDataSlice = createSlice({
  name: "chartData",
  initialState: initialState,
  reducers: {
    setIsUserSignedIn: (state, action) => {
      state.chartData = action.payload;
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
    setDateFilter: (state, action) => {
      state.chartFilterData = action.payload;
    },
  },
});
