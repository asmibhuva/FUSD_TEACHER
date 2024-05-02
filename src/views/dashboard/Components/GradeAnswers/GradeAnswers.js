import { CSpinner } from "@coreui/react";
import { makeStyles } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AWSConfig, COGNITODOMAIN, HOSTURL, REGION } from "src/aws-exports";
import { signOut } from "src/__dataConfig/Login/LoginCRUD";
import { ChartDataSlice } from "src/__redux/chartData/ChartData";
import { getDashboardData } from "src/__redux/Query/APIReq";
import CustomHeader from "../CustomHeader/CustomHeader";
import CustomTable from "../CustomTable/CustomTable";
import CustomModal from "../CustomModal/CustomModal";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    fontSize: "20px",
    padding: "20px 30px",
    marginTop: "10px",
    [theme.breakpoints.down("sm")]: {
      padding: "10px 20px",
    },
  },
  question: {
    // background:"#eee",
    color: "#3d4b64",
    // textAlign: "center",
    fontSize: "22px",
    marginBottom: "10px",
    fontWeight: "600",
    [theme.breakpoints.down("md")]: {
      fontSize: "18px",
    },
  },
  table: {
    fontSize: "1rem",
  },
  header: {
    fontWeight: "bold",
    fontSize: "22px",
    [theme.breakpoints.down("md")]: {
      fontSize: "20px",
    },
  },
  chartContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      height: "300px",
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      height: "400px",
      width: "50%",
    },
  },
}));
const GradeAnswers = () => {
  const classes = useStyles();
  const { actions } = ChartDataSlice;
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { studentAnsMetrics, totalAnswers, totalAnonymous, chartFilterData } =
    useSelector(
      (state) => ({
        studentAnsMetrics: state?.chartData?.chartData?.studentAnswersMetrics,
        totalAnswers: state?.chartData?.chartData?.totalAnswers,
        totalAnonymous: state?.chartData?.chartData?.totalAnonymous,
        chartFilterData: state?.chartData?.chartFilterData,
      }),
      shallowEqual
    );

  const getData = () => {
    setIsLoading(true);
    getDashboardData({
      fromDate: moment(chartFilterData?.fromDate)?.format("YYYY-MM-DD"),
      toDate: moment(chartFilterData?.toDate)?.format("YYYY-MM-DD"),
    })
      .then(({ data }) => {
        dispatch(actions.setIsUserSignedIn(data.getAnswersMetrics));
      })
      .catch((err) => {
        window.alert("Error in Getting dashboard Data");
        setIsLoading(false);
        dispatch(actions.setIsUserSignedIn({}));
        console.log("Error in Getting dashboard Data");
        console.log(err);
        console.log("queERR", err);
        const currentActiveSession = JSON.parse(
          sessionStorage.getItem("currentSesion")
        );
        if (currentActiveSession?.loginMode === "MS") {
          console.log("Log out from Azure account");
          sessionStorage.clear();
          window.location = `https://${COGNITODOMAIN}.auth.${REGION}.amazoncognito.com/logout?client_id=${AWSConfig.aws_user_pools_web_client_id}&logout_uri=${HOSTURL}`;
        } else {
          console.log("Log out from Amplify account");
          if (currentActiveSession?.loginMode === "AMPLIFY") {
            signOut()
              .then((res) => {
                sessionStorage.clear();
                history.push("/login");
              })
              .catch((err) => {
                console.log("Error in SignOut", err);
              })
              .finally(() => {});
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [chartFilterData]);

  const handleCallback = (start, end) => {
    dispatch(
      actions.setDateFilter({
        fromDate: start?.format("YYYY-MM-DD"),
        toDate: end?.format("YYYY-MM-DD"),
      })
    );
  };

  const handleShowClick = (value) => {
    dispatch(actions.setSelectedStudent(value));
    setIsModalOpen((prev) => !prev);
  };
  const handleClose = () => {
    setIsModalOpen((prev) => !prev);
  };

  return isLoading ? (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CSpinner
        style={{ background: "#111" }}
        color="dark"
        grow
        label="No Question Found"
      />
    </div>
  ) : (
    <>
      <CustomHeader
        showRefreshBtn={true}
        handleRefresh={getData}
        handleCallback={handleCallback}
        chartFilterData={chartFilterData}
        styles={{ justifyContent: "end" }}
      />
      <div className={classes.card} style={{ marginBottom: "10px" }}>
        <div className={classes.question}>
          Number of Questions answered by students:
          {totalAnswers && (
            <span style={{ fontWeight: "400" }}>
              {" "}
              (Total Answers : {totalAnswers}, Anonymous : {totalAnonymous})
            </span>
          )}
        </div>
        <CustomTable
          rowData={studentAnsMetrics}
          showDetails={true}
          handleModalClose={handleShowClick}
        />
      </div>
      <CustomModal open={isModalOpen} handleClose={handleClose} />
    </>
  );
};

export default GradeAnswers;
