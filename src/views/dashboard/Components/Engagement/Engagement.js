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
  }
}))

const Engagement = () => {

  const classes = useStyles()
  const history = useHistory()

  const bar = {
    labels: ['Low', 'Partial', 'Good', 'High'],
    datasets: [{
      label: 'Votes',
      data: [65, 59, 80, 81],
      backgroundColor: "#7388A9d1",
      borderColor: "#7388A9",
      borderWidth: 1
    }]
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
        &nbsp;&nbsp;Engagement in class Data
      </CCardHeader>
      <CCardBody>
        <div className={classes.question}>Question: Engagement in the Mathematics classwork.</div>
        <Bar
          data={bar}
          style={{
            maxHeight: "600px",
          }}
          options={{
            title: {
              display: true,
              fontSize: 20,
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

export default Engagement
