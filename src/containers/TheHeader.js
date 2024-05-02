import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { CHeader, CHeaderNav, CSpinner, CToggler } from "@coreui/react";

import { IconButton, makeStyles } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { signOut } from "src/__dataConfig/Login/LoginCRUD";
import { Auth } from "aws-amplify";
import { AuthSlice } from "src/__redux/Auth/AuthSlice";
import { Redirect } from "react-router";
import { SideBarSlice } from "src/__redux/SideBar/SideBarSlice";
import { TheHeaderDropdown, TheHeaderDropdownNotif } from ".";
import { parseJwt } from "src/App";
import { AWSConfig, COGNITODOMAIN, HOSTURL, REGION } from "src/aws-exports";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    fontSize: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    paddingRight: "10px",
  },
  img: {
    width: "85px",
  },
}));

const TheHeader = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { actions: sidebarShowActions } = SideBarSlice;

  // const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    console.log("Clocked");
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch(sidebarShowActions.setSidebarShow(val));
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch(sidebarShowActions.setSidebarShow(val));
  };

  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const session = await Auth.currentSession();
      if (session) {
        const name = session.getIdToken().payload.name;
        setUserName(name);
      } else {
        setUserName("");
      }
    })();
  }, []);

  const history = useHistory();
  const { actions: authActions } = AuthSlice;
  const defaultSchName = "CESR";
  const [schoolName, setSchoolName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { sidebarShow } = useSelector(
    (state) => ({
      // isUserSignedIn: state.auth.isUserSignedIn,
      sidebarShow: state.sidebarShow.sidebarShow,
    }),
    shallowEqual
  );
  useEffect(() => {
    const currentSession = sessionStorage.getItem("currentSesion");

    // console.log(JSON.parse(currentSession).id_token)
    const dcodeData = parseJwt(JSON.parse(currentSession).id_token);
    console.log("dcodeData", dcodeData);
    setSchoolName(dcodeData.profile);
    setIsAdmin(dcodeData["cognito:groups"].includes("Admin"));
  }, []);

  const signOutHandler = () => {
    setIsLoading(true);
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
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
    // signOut().then(res => {
    //   dispatch(authActions.setIsUserSignedIn(false))
    //   // history.replace("/login")
    // }).catch(err => {
    //   console.log("Error in SignOut", err)
    // }).finally(() => {
    //   setIsLoading(false)
    // })
  };

  // useEffect(() => {
  //   if (isUserSignedIn === false) {
  //     history.push("/login")
  //   }
  // }, [isUserSignedIn])

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
    <CHeader className={classes.header}>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <div
        style={{ display: "flex", flex: "1", justifyContent: "space-between" }}
      >
        {isAdmin ? (
          <div style={{ height: "85px" }}></div>
        ) : (
          schoolName === "Cypress Elementary School" && (
            <img className={classes.img} src="./assets/CESR.png"></img>
          )
        )}
        {isAdmin ? (
          <div style={{ height: "85px" }}></div>
        ) : (
          schoolName === "Jurupa Hills High School" && (
            <img className={classes.img} src="./assets/JHHS.png"></img>
          )
        )}

        <CHeaderNav className="px-3">
          <TheHeaderDropdown signOutHandler={signOutHandler} />
        </CHeaderNav>
      </div>
      {/* <TheHeaderDropdown /> */}
      {/* <IconButton
        color="inherit"
        className={classes.iconButton}
        onClick={signOutHandler}
      >
        <AccountCircle />
        
      </IconButton> */}
    </CHeader>
  );
};

export default TheHeader;
