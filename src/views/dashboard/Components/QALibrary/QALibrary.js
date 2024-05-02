import { CSpinner } from "@coreui/react";
import { makeStyles } from "@material-ui/core";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AddQuestionForm } from "./AddQuestionForm";
import QuestionTable from "./QuestionTable";
import QuestionTableAdmin from "./QuestionTableAdmin";
import { parseJwt } from "src/App";

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
  questionHeader: {
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
}));

const QALibrary = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const currentSession = sessionStorage.getItem("currentSesion");

    // console.log(JSON.parse(currentSession).id_token)
    const dcodeData = parseJwt(JSON.parse(currentSession).id_token);
    // console.log("dcodeData", dcodeData);

    setIsUserAdmin(dcodeData["cognito:groups"].includes("Admin"));
  }, []);

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
      {isUserAdmin ? (
        <div className={classes.card} style={{ marginBottom: "10px" }}>
          <QuestionTableAdmin />
        </div>
      ) : (
        <>
          <div className={classes.card} style={{ marginBottom: "10px" }}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" sx={{ backgroundColor: " #fff " }}>
                <Toolbar>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, color: "#3d4b64" }}
                  >
                    Question List
                  </Typography>
                  <Button
                    style={{
                      backgroundColor: "#3d4b64",
                      color: "#fff",
                    }}
                    onClick={() => setOpen(true)}
                  >
                    + Add
                  </Button>
                </Toolbar>
              </AppBar>
            </Box>
          </div>
          <div>
            <AddQuestionForm show={open} onHide={() => setOpen(false)} />
          </div>
          <div className={classes.card} style={{ marginBottom: "10px" }}>
            <div className={classes.questionHeader}>
              Number of Questions added by teacher:
            </div>
            <QuestionTable />
          </div>
        </>
      )}
    </>
  );
};
export default QALibrary;
