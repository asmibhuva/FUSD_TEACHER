import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import { IconButton, makeStyles } from '@material-ui/core';
import React from 'react'
import { Pie, Doughnut } from 'react-chartjs-2';
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
  },
  chartContainer:{
    [theme.breakpoints.down("sm")]: {
      height:"300px",
      width:"100%",
    },
    [theme.breakpoints.up("sm")]: {
      height:"400px",
      width:"50%",
    },
  }
}))
const MentalHealth = () => {

  const classes = useStyles()
  const history = useHistory()

  const bar = {
    labels: [
      'Yes',
      'No',
      'Maybe',
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  const bar2 = {
    labels: [
      'Homework',
      'Classwork',
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
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
        &nbsp;&nbsp;Mental Health Of Class
      </CCardHeader>
      <CCardBody>
        <div className={classes.question}>Question: Do you think you are given to much homework?</div>
        <div className={classes.chartContainer}>
          <Pie
            maintainAspectRatio={true}
            responsive={true}
            style={{ maxHeight: "400px" }}
            data={bar}
            options={{
              maintainAspectRatio: false,
            }
            }
          />
        </div>
      </CCardBody>
      <CCardBody>
        <div className={classes.question}>Question: What cause more stress?</div>
        <div className={classes.chartContainer}>
        <Doughnut
          maintainAspectRatio={true}
          responsive={true}
          style={{ maxHeight: "400px" }}
          data={bar2}
        />
        </div>
      </CCardBody>
    </CCard>
  )
}

export default MentalHealth
