import { CSpinner } from '@coreui/react'
import { makeStyles } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { parseJwt } from 'src/App'
import { AWSConfig, COGNITODOMAIN, HOSTURL, REGION } from 'src/aws-exports'
import { signOut } from 'src/__dataConfig/Login/LoginCRUD'
import { ChartDataSlice } from 'src/__redux/chartData/ChartData'
import { getDashboardData } from 'src/__redux/Query/APIReq'
import CustomHeader from './Components/CustomHeader/CustomHeader'
import CustomTable from './Components/CustomTable/CustomTable'

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    fontSize: "20px",
    padding: "20px 30px",
    marginTop: "10px"
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
  }
}))

// const dashboardConfig = [
//   {
//     title: "Engagement",
//     to: "/engagement"
//   },
//   {
//     title: "Mental Health",
//     to: "/mentalHealth"
//   },
//   {
//     title: "Safety",
//     to: "/safety"
//   },
// ]


const Dashboard = () => {


  const classes = useStyles();

  const { actions } = ChartDataSlice;
  const history = useHistory();
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const {
    answerModeMetrics,
    studentAnsMetrics,
    totalAnswers,
    totalAnonymous,
    chartFilterData,
  } = useSelector(
    (state) => ({
      answerModeMetrics: state?.chartData?.chartData?.answerModeMetrics,
      studentAnsMetrics: state?.chartData?.chartData?.studentAnswersMetrics,
      totalAnswers: state?.chartData?.chartData?.totalAnswers,
      totalAnonymous: state?.chartData?.chartData?.totalAnonymous,
      chartFilterData: state?.chartData?.chartFilterData,
    }),
    shallowEqual
  );

  const dispatch = useDispatch()

  // const [dateRange, setDateRange] = useState({
  //   toDate: moment().toDate(),
  //   fromDate: moment().subtract(6, "days").toDate(),
  // })

  const bar = {
    labels: [
      'Answered Anonymously',
      'Answered',
      'Skipped',
    ],
    datasets: [{
      data: Object.values(answerModeMetrics || [0, 0, 0]),
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  const getData = () => {
    setIsLoading(true)
    getDashboardData({
      fromDate: moment(chartFilterData?.fromDate)?.format("YYYY-MM-DD"),
      toDate: moment(chartFilterData?.toDate)?.format("YYYY-MM-DD"),
    }).then(({ data }) => {
      dispatch(actions.setIsUserSignedIn(data.getAnswersMetrics))
    }).catch(err => {
      window.alert("Error in Getting dashboard Data");
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

  const handleCallback = (start, end) => {
    dispatch(actions.setDateFilter({
      fromDate: start?.format("YYYY-MM-DD"),
      toDate: end?.format("YYYY-MM-DD"),
    }))
  };

  useEffect(() => {
    const currentSession = sessionStorage.getItem("currentSesion")
    // console.log(JSON.parse(currentSession).id_token)
    const dcodeData = parseJwt(JSON.parse(currentSession).id_token)
    setUserName(dcodeData.given_name)
  }, [])


  return (
    isLoading ? <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <CSpinner style={{ background: "#111" }} color="dark" grow label="No Question Found" />
    </div> :
      <>
        <CustomHeader
          userName={userName}
          showRefreshBtn={true}
          handleCallback={handleCallback}
          chartFilterData={chartFilterData}
          handleRefresh={getData}
        />
        {/* <Content configData={dashboardConfig} /> */}
        <div className={classes.card} >
          <div className={classes.question}>Questions</div>

          {answerModeMetrics && !Object.values(answerModeMetrics).every(i => i === 0) ?
            <div className={classes.chartContainer}>
              <Pie
                style={{ maxHeight: "400px" }}
                plugins={[ChartDataLabels]}
                data={bar}
                options={{
                  maintainAspectRatio: false,
                  cubicInterpolationMode: "monotone",
                  scaleShowLabels: true,
                  responsive: true,
                  // tooltips: {
                  //   callbacks: {
                  //     label: function (tooltipItem, data) {
                  //       var dataset = data.datasets[tooltipItem.datasetIndex];
                  //       var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                  //       var total = meta.total;
                  //       var currentValue = dataset.data[tooltipItem.index];
                  //       var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                  //       return currentValue + ' (' + percentage + '%)';
                  //     },
                  //     title: function (tooltipItem, data) {
                  //       return data.labels[tooltipItem[0].index];
                  //     }
                  //   }
                  // }
                  plugins: {
                    datalabels: {
                      formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                          sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                      },
                      color: '#fff',
                    }
                  }
                }
                }
              />
            </div>
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

        </div>
        <div className={classes.card} style={{ marginBottom: "10px" }}>
          <div className={classes.question}>
            Number of Questions answered by  students:
            {totalAnswers && <span style={{ fontWeight: "400" }}> (Total Answers : {totalAnswers}, Anonymous : {totalAnonymous})</span>}</div>
          <CustomTable
            rowData={studentAnsMetrics}
            showDetails={false}
          />
        </div>
      </>
  )
}

export default Dashboard
