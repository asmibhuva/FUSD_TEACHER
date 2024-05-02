import { CCard } from '@coreui/react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import React from 'react'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: "#fff",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    fontSize: "20px",
    cursor: "pointer",
  },
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: "1fr",
    },
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: "1fr 1fr",
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: "1fr 1fr 1fr",
    },
  }
}))

const Content = ({
  configData
}) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      {
        configData.map((data, i) => (
          <div key={i} className={classes.card} onClick={()=> history.push(data.to)}>
            {data.title}
          </div>
        ))
      }
    </div>
  )
}

export default Content
