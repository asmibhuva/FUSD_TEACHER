import React from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { Button, IconButton } from "@material-ui/core";

const CustomHeader = ({
  userName,
  handleCallback,
  chartFilterData,
  styles = {},
  showRefreshBtn = false,
  handleRefresh,
}) => {
  const label = chartFilterData
    ? "From: " +
      moment(chartFilterData?.fromDate)?.format("YYYY-MM-DD") +
      " | To: " +
      moment(chartFilterData?.toDate)?.format("YYYY-MM-DD")
    : "-";

  // console.log("selectionRange", selectionRange)
  // console.log("selectionRange", dateRange)

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: "10px",
        alignItems: "center",
        ...styles,
      }}
    >
      {userName && (
        <span style={{ fontWeight: "bold", fontSize: "30px" }}>
          Welcome, {userName}
        </span>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "end",
          gap: "10px",
          flexFlow: "row",
        }}
      >
        <DateRangePicker
          initialSettings={{
            startDate: moment(chartFilterData?.fromDate)?.toDate(),
            endDate: moment(chartFilterData?.toDate)?.toDate(),
            // autoUpdateInput: false,
            ranges: {
              Today: [moment().toDate(), moment().toDate()],
              Yesterday: [
                moment().subtract(1, "days").toDate(),
                moment().subtract(1, "days").toDate(),
              ],
              "Last 7 Days": [
                moment().subtract(6, "days").toDate(),
                moment().toDate(),
              ],
              "Last 30 Days": [
                moment().subtract(29, "days").toDate(),
                moment().toDate(),
              ],
              "This Month": [
                moment().startOf("month").toDate(),
                moment().endOf("month").toDate(),
              ],
              "Last Month": [
                moment().subtract(1, "month").startOf("month").toDate(),
                moment().subtract(1, "month").endOf("month").toDate(),
              ],
            },
          }}
          onCallback={handleCallback}
          // onApply={handleApply}
          // onCancel={handleCancel}
        >
          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "300",
                fontStyle: "italic",
              }}
            >
              Select Date Range:
            </span>
            <div
              id="reportrange"
              style={{
                background: "#fff",
                cursor: "pointer",
                padding: "8px 10px",
                border: "1px solid #ccc",
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                borderRadius: "4px",
              }}
            >
              <DateRangeIcon />
              &nbsp;
              <span>{label}</span> <i className="fa fa-caret-down"></i>
            </div>
            {/* <button>{label}</button> */}
          </div>
        </DateRangePicker>
        <IconButton
          size="medium"
          style={{
            backgroundColor: "#3d4b64",
            borderRadius: "10px",
            color: "#fff",
            minWidth: "auto",
          }}
          onClick={handleRefresh}
        >
          <i className="fas fa-redo-alt" style={{ fontSize: "1.2rem" }}></i>
        </IconButton>
      </div>
    </div>
  );
};

export default CustomHeader;
