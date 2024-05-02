import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { IconButton, Divider } from '@material-ui/core';
import { shallowEqual, useSelector } from 'react-redux';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from "moment";
import TodayIcon from '@material-ui/icons/Today';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentData: {
    fontSize: "0.8rem",
    fontWeight: "300",
    color: "#000",
    [theme.breakpoints.up("xs")]: {
      fontSize: "0.8rem",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.9rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.2rem",
    },
  },
  dialogContent: {
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    columnGap: "16px",
  },
  contentTitle: {
    fontSize: "1.2rem",
    color: "#000",
    fontWeight: "bold",
    [theme.breakpoints.up("xs")]: {
      fontSize: "0.8rem",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.9rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.2rem",
    },
  },
  dialogQuestionContent: {
    // marginTop: "16px",
    flex: 1,
  },

  questionBg: {
    backgroundColor: "#3d4b6428",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px 0px"
  },
  question: {
    color: "#3d4b64",
    fontWeight: "700",
    fontSize: "1.1rem",
    display: "flex",
    justifyContent: "space-between",
  },
  timeStamp: {
    // fontStyle: "italic",
    color: "rgba(0, 0, 0, 0.54)",
    fontWeight: "400",
    fontSize: "0.8rem",
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
  closeIcon: {
    [theme.breakpoints.up("sx")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2rem",
    },
  }
}));

const CustomModal = ({ open, handleClose }) => {
  const classes = useStyles();

  const {
    selectedStudent,
  } = useSelector(
    (state) => ({
      selectedStudent: state?.chartData?.selectedStudent,
    }),
    shallowEqual
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ style: { paddingBottom: "10px" } }}
      maxWidth="md"
      fullWidth={true}
      style={{
        paddingBottom: "8px"
      }}
    >
      <DialogTitle id="alert-dialog-title"
        className={classes.dialogTitle}
        disableTypography
      >
        <div className={classes.dialogContent}>
          <div className={classes.contentTitle}>Student ID</div>
          <div className={classes.studentData}>{selectedStudent?.id}</div>
          <div className={classes.contentTitle}>Student Name</div>
          <div className={classes.studentData}>{selectedStudent?.name}</div>
        </div>
        <IconButton
          onClick={handleClose}
          style={{
            color: "#3d4b64",
          }}
        >
          <HighlightOffIcon className={classes.closeIcon} />
        </IconButton>
      </DialogTitle>
      <Divider style={{ height: "2px", opacity: "0.8", backgroundColor: "#3d4b64" }} />
      <DialogContent style={{ display: "flex", flexDirection: "column" }}>

        <DialogContentText className={classes.dialogQuestionContent}>
          {selectedStudent?.details?.map((data, ii) => (
            <div className={classes.questionBg}>
              <span className={classes.question}>
                ({(ii+1)})&nbsp;{data.questionLabel}
                <span className={classes.timeStamp}>
                  {moment(data.answeredAt).format(`YYYY-MM-DD | HH:mm A`)}
                  {/* <AccessTimeIcon />{moment(data.answeredAt).format(``)} */}
                </span>
              </span>
              <div className={classes.option}>
                {data.answersLabel.map((mcqData, i) => (
                  <div
                    style={{
                      color: i === data.selectedAnswer && "#3d4b64",
                      fontWeight: i === data.selectedAnswer && "500",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "5px",
                    }}>
                    {i === data.selectedAnswer
                      ? <RadioButtonCheckedIcon fontSize="small" />
                      : <RadioButtonUncheckedIcon fontSize="small" />
                    }{mcqData}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </DialogContentText>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions> */}
    </Dialog>
  )
}

export default CustomModal
