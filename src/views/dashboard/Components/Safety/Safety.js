import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import { IconButton, makeStyles } from '@material-ui/core';
import React from 'react'
import { Bar } from 'react-chartjs-2';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  question: {
    // background:"#eee",
    // textAlign: "center",
    fontSize: "20px",
    marginBottom: "10px",
    [theme.breakpoints.down("md")]:{
      fontSize: "18px",
    },
  },
  header: {
    fontWeight: "bold",
    fontSize: "22px",
    [theme.breakpoints.down("md")]:{
      fontSize: "20px",
    },
  }
}))
const Safety = () => {

  const classes = useStyles()
  const history = useHistory()

  const bar = {
    labels: ['No', 'Yes,Bullied', "I don't know", 'Prefer not to say'],
    datasets: [
      {
        label: 'Boys',
        backgroundColor: "#7388A9",
        borderColor: "#7388A9",
        borderWidth: 1,
        data: [65, 81 ,55, 40]
      },
      {
        label: 'Girls',
        backgroundColor: "#46546C",
        borderColor: "#46546C",
        borderWidth: 1,
        data: [45, 41, 16, 85]
      }
    ],
  };

  return (
    <CCard>
      <CCardHeader className={classes.header}>
        <IconButton
          color="inherit"
          onClick={() => history.goBack()}
        >
          <ArrowBackIcon />
        </IconButton>
        &nbsp;&nbsp;Safety
      </CCardHeader>
      <CCardBody>
        <div className={classes.question}>Question: Have you ever felt bullied in class?</div>
        <Bar
          data={bar}
          style={{
            maxHeight:"600px",
          }}
          options={{
            title: {
              display: true,
              fontSize: 20
            },
            legend: {
              display: true,
              position: 'right'
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
                }
              }
            }
          }}
        />
      </CCardBody>
    </CCard>
  )
}

export default Safety
