import { CCard, CCardBody, CSpinner } from '@coreui/react'
import { makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { AWSConfig, COGNITODOMAIN, HOSTURL, REGION } from 'src/aws-exports'
import { signOut } from 'src/__dataConfig/Login/LoginCRUD'
import { ChartDataSlice } from 'src/__redux/chartData/ChartData'
import { getDashboardData } from 'src/__redux/Query/APIReq'
import CustomHeader from '../CustomHeader/CustomHeader'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const useStyles = makeStyles(theme => ({
  question: {
    // background:"#eee",
    // textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "10px",
    [theme.breakpoints.down("md")]: {
      fontSize: "18px",
    },
  },
  header: {
    fontWeight: "bold",
    fontSize: "22px",
    [theme.breakpoints.down("md")]: {
      fontSize: "20px",
    },
  },
  option: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    padding: "15px",
    [theme.breakpoints.up("xs")]: {
      gridTemplateColumns: "1fr",
    },
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "1fr 1fr",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "1fr 1fr 1fr",
    }
  },
}))
const StudentAnswers = () => {

  const classes = useStyles()
  const history = useHistory()

  const { actions } = ChartDataSlice;
  const [isLoading, setIsLoading] = useState(true)
  const { q3Metrics, questionBasedAnswerMetrics, q6Metrics, chartFilterData } = useSelector(
    (state) => ({
      questionBasedAnswerMetrics: state?.chartData?.chartData?.questionBasedAnswerMetrics,
      q3Metrics: state?.chartData?.chartData?.q3Metrics,
      q6Metrics: state?.chartData?.chartData?.q6Metrics,
      chartFilterData: state?.chartData?.chartFilterData,
    }),
    shallowEqual
  );

  const dispatch = useDispatch()
  const question3 = "What's your favorite subject in school?"
  const question6 = "What is your favorite sport to play?"
  // const [chartFilterData, setchartFilterData] = useState({
  //   toDate: moment().toDate(),
  //   fromDate: moment().subtract(6, "days").toDate(),
  // })
  const barQ3 = {
    labels: q3Metrics ? q3Metrics.map(data => data.choiceName) : [],
    datasets: [{
      data: q3Metrics ? q3Metrics.map(data => data.choiceVote) : [],
      backgroundColor: "#7388A9d1",
      borderColor: "#7388A9",
      borderWidth: 1
    }]
  };
  const options = {
    maintainAspectRatio: false,
    cubicInterpolationMode: "monotone",
    scaleShowLabels: true,
    responsive: true,
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    animation: {
      duration: false
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y:
      {
        grid: {
          display: false
        },
        ticks: {
          min: 0,
          stepSize: 1,
          beginAtZero: true,
          // callback: function (tick, index, labels) {
          //   if (Math.floor(tick) === tick) {
          //     return tick;
          //   }

          // }
        }
      }
    }
  }
  const barQ6 = {
    labels: q6Metrics ? q6Metrics.map(data => data.choiceName) : [],
    datasets: [{
      data: q6Metrics ? q6Metrics.map(data => data.choiceVote) : [],
      backgroundColor: "#7388A9d1",
      borderColor: "#7388A9",
      borderWidth: 1
    }]
  };
  const handleCallback = (start, end) => {
    dispatch(actions.setDateFilter({
      fromDate: start?.format("YYYY-MM-DD"),
      toDate: end?.format("YYYY-MM-DD"),
    }))
  };

  const getData = () => {
    setIsLoading(true)
    getDashboardData({
      fromDate: moment(chartFilterData?.fromDate)?.format("YYYY-MM-DD"),
      toDate: moment(chartFilterData?.toDate)?.format("YYYY-MM-DD"),
    }).then(({ data }) => {
      dispatch(actions.setIsUserSignedIn(data.getAnswersMetrics))
    }).catch(err => {
      setIsLoading(false)
      dispatch(actions.setIsUserSignedIn({}))
      console.log("Error in Getting dashboard Data")
      console.log(err)
      console.log("queERR", err)
      const currentActiveSession = JSON.parse(sessionStorage.getItem('currentSesion'))
      if (currentActiveSession?.loginMode === "MS") {
        console.log('Log out from Azure account')
        sessionStorage.clear();
        window.location = `https://${COGNITODOMAIN}.auth.${REGION}.amazoncognito.com/logout?client_id=${AWSConfig.aws_user_pools_web_client_id}&logout_uri=${HOSTURL}`
      }
      else {
        console.log('Log out from Amplify account')
        if (currentActiveSession?.loginMode === "AMPLIFY") {
          signOut().then(res => {
            sessionStorage.clear();
            history.push("/login")
          }).catch(err => {
            console.log("Error in SignOut", err)
          }).finally(() => {
          })
        }
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [chartFilterData])

  return (
    isLoading ? <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CSpinner style={{ background: "#111" }} color="dark" grow label="No Question Found" />
    </div> :
      <>
        <CustomHeader
          showRefreshBtn={true}
          handleRefresh={getData}
          handleCallback={handleCallback} chartFilterData={chartFilterData} styles={{ justifyContent: "end" }} />

        {
          questionBasedAnswerMetrics?.map((questionData) => (
            <CCard>
              <CCardBody>
                <div className={classes.question}>Question: {questionData?.question}</div>
                {questionData?.options ? <Bar
                  data={{
                    labels: questionData?.options?.map(({choiceName}) => choiceName) || [],
                    datasets: [{
                      data: questionData?.options?.map(({choiceVote}) => choiceVote) || [],
                      backgroundColor: "#7388A9d1",
                      borderColor: "#7388A9",
                      borderWidth: 1
                    }]
                  }}
                  style={{
                    maxHeight: "600px",
                    maxWidth: "90%",
                  }}
                  options={options}
                />
                  : <div style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                  }}
                  >
                    <Alert severity="error">No Record Found!</Alert>
                  </div>
                }
              </CCardBody>
            </CCard>
          ))}

        {/* <CCard>
          <CCardBody>
            <div className={classes.question}>Question: {question3}</div>
            {q3Metrics && !q3Metrics?.map(data => data.choiceVote).every(i => i === 0) ? <Bar
              data={barQ3}
              style={{
                maxHeight: "600px",
                maxWidth: "700px",
              }}
              options={options}
            />
              : <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
              >
                <Alert severity="error">No Record Found!</Alert>
              </div>
            }
          </CCardBody>
        </CCard>
        <CCard>
          <CCardBody>
            <div className={classes.question}>Question: {question6}</div>
            {q6Metrics && !q6Metrics?.map(data => data.choiceVote).every(i => i === 0) ? <Bar
              data={barQ6}
              style={{
                maxHeight: "600px",
                maxWidth: "700px",
              }}
              options={options}
            />
              : <div style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
              >
                <Alert severity="error">No Record Found!</Alert>
              </div>}
          </CCardBody>
        </CCard> */}
      </>
  )
}

export default StudentAnswers
