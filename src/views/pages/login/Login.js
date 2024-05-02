import React, { useEffect, useState } from "react";
import { CCol, CRow, CSpinner } from "@coreui/react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, makeStyles } from "@material-ui/core";
import { Form } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { PUBLIC_PATH } from "../../../index.js";
import { signIn } from "src/__dataConfig/Login/LoginCRUD.js";
import { useDispatch, useSelector } from "react-redux";
import { AuthSlice } from "src/__redux/Auth/AuthSlice.js";
import { shallowEqual } from "react-redux";
import {
  AWSAppSyncConfig,
  AWSConfig,
  COGNITODOMAIN,
  HOSTURL,
  MS_SAML,
  REGION,
} from "src/aws-exports.js";
import Amplify, { AmplifyClass } from "@aws-amplify/core";

const schema = yup.object().shape({
  email: yup.string().email().trim().required("Email is required"),
  password: yup.string().trim().required("Password is required"),
});
const init = {
  email: "",
  password: "",
};

const useStyles = makeStyles((theme) => ({
  root: {
    // clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)",
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      background: "URL(./assets/LoginMd.png)",
      backgroundPosition: "bottom left",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto",
    },
    [theme.breakpoints.up("md")]: {
      background: "#fff",
    },
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexFlow: "column",
    width: "100%",
    padding: "30px",
    [theme.breakpoints.up("md")]: {
      padding: "1rem 7rem",
    },
  },
  textField: {
    height: "80px",
    fontSize: "20px",
    width: "100%",
    margin: "10px 0",
    border: "1px solid #3C4B64",
    "&:focus": {
      border: "1px solid #3C4B64",
      boxShadowColor: "#3C4B64",
    },
    [theme.breakpoints.down("sm")]: {
      height: "40px",
      fontSize: "14px",
      borderRadius: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      height: "50px",
      fontSize: "18px",
      padding: "0 20px",
      borderRadius: "15px",
    },
    [theme.breakpoints.up("md")]: {
      height: "50px",
      fontSize: "18px",
      padding: "0 20px",
      borderRadius: "20px",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "20px",

      height: "60px",
      padding: "0 30px",
    },
  },
  svgContainer: {
    background: "#e1e1e1",
    // height: window.innerHeight,
    clipPath: "ellipse(75% 95% at 23% 50%)",
    height: "auto",
    // width: "100%",

    // borderTopRightRadius:"20% 70%",
    // borderBottomRightRadius:"20% 70%",
    // transform: "skew(-5deg, 0deg) translate(-44px, 0px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    // [theme.breakpoints.down('lg')]: {
    //   // background:`url(${LoginSvg})`,
    // },
    // [theme.breakpoints.up('sm')]: {
    //   display:"none"
    // },
  },
  svg: {
    height: "auto",
    width: "auto",
    // transform: "rotateZ(0deg) skew(5deg, 0deg)",
  },
  signIN: {
    fontWeight: "bold",
    fontSize: "40px",
    textAlign: "center",
  },
  signINTxt: {
    fontSize: "22px",
    fontStyle: "italic",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "22px",
    },
  },
  logo: {
    [theme.breakpoints.down("sm")]: {
      width: "70%",
    },
    [theme.breakpoints.between("sm", "lg")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%",
    },
  },
  msBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.2rem",
    },
  },
  btn: {
    padding: "10px 60px",
    backgroundColor: "#3C4B64",
    color: "#fff",
    cursor: "pointer",
    maxWidth: "250px",
    fontSize: "18px",
    borderRadius: "5px",
    textAlign: "center",
    border: "none",
    "&:hover": {
      backgroundColor: "#3C4B64",
      borderColor: "#3C4B64",
      boxShadow: "0 0 0 0.2rem rgb(61 75 100 / 25%)",
    },
    "&:active": {
      backgroundColor: "#3C4B64",
      borderColor: "#3C4B64",
      boxShadow: "0 0 0 0.2rem rgb(61 75 100 / 25%)",
    },
    // maxWidth:"150px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "20px",
      marginRight: "10px",
      padding: "5px 15px",
    },
    [theme.breakpoints.up("sm")]: {
      marginTop: "20px",
      fontSize: "14px",
      // marginRight: "15px",
      padding: "8px 30px",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: "20px",
      fontSize: "18px",
      // marginRight: "15px",
      // padding: "10px 50px",
    },
    [theme.breakpoints.up("lg")]: {
      marginTop: "20px",
      marginRight: "20px",
      padding: "10px 60px",
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  // console.log(PUBLIC_PATH);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const dispatch = useDispatch();
  const { actions } = AuthSlice;

  // const { isUserSignedIn } = useSelector(
  //   (state) => ({
  //     isUserSignedIn: state.auth.isUserSignedIn,
  //   }),
  //   shallowEqual
  // );

  const handleFormSubmit = (values) => {
    // console.log(values)
    setIsLoading(true);
    signIn({ username: values.email, password: values.password })
      .then((res) => {
        // console.log("Amplify Login Res ", res)
        console.log("Authorized");
        sessionStorage.setItem(
          "currentSesion",
          JSON.stringify({
            id_token: res.signInUserSession.idToken.jwtToken,
            access_token: res.signInUserSession.accessToken.jwtToken,
            loginMode: "AMPLIFY",
            // name =
          })
        );
        Amplify.configure({
          API: {
            graphql_endpoint: AWSAppSyncConfig.aws_appsync_graphqlEndpoint,
            graphql_headers: () => ({
              Authorization: res.signInUserSession.idToken.jwtToken, // Set Custom Request Headers for non-AppSync GraphQL APIs
            }),
          },
        });
        history.push("/overview");
      })
      .catch((err) => {
        setErr("Invalid Credentials");
        console.log("err", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   if (isUserSignedIn === true) {
  //     history.push("/overview")
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
    <div
      className={`${classes.root} justify-content-center c-app c-default-layout flex-column align-items-center`}
    >
      <CRow className={`justify-content-center w-100 ${classes.row}`}>
        <CCol
          style={{ display: "flex" }}
          className={`${classes.svgContainer} d-md-down-none`}
          md="7"
          lg="7"
        >
          <img src={"./assets/Login.svg"} className={classes.svg} />
        </CCol>
        <CCol
          sm={12}
          className={classes.formCont}
          style={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            flexFlow: "column",
          }}
          md="9"
          lg="5"
        >
          <div
            style={{
              width: "100%",
              padding: "50px 0px",
              paddingTop: "0px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexFlow: "column",
            }}
          >
            <img src="./assets/image.png" className={classes.logo} />
            <div className={classes.signIN}>SIGN IN</div>
            <div className={classes.signINTxt}>
              Enter your detail to login to your account.
            </div>
            <Formik
              initialValues={init}
              validationSchema={schema}
              onSubmit={(values, { onSubmit }) => {
                // onSubmit(values);
                handleFormSubmit(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <Form onSubmit={handleSubmit} className={classes.form}>
                  <span style={{ color: "red" }}>{err}</span>
                  <Form.Group
                    controlId="formBasicEmail"
                    className="required w-100 justify-content-center"
                  >
                    <Form.Control
                      className={`${classes.textField}`}
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      prefix={<MailOutlineIcon />}
                      value={values.email}
                      isInvalid={touched.email && errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      Email is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    controlId="formBasicPassword"
                    className="required w-100 justify-content-center"
                  >
                    <Form.Control
                      className={`${classes.textField}`}
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      isInvalid={touched.password && errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      Password is required
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button className={classes.btn} type="submit">
                    Sign In
                  </Button>
                </Form>
              )}
            </Formik>
            <span
              style={{
                opacity: "50%",
                marginTop: "20px",
              }}
            >
              ---- or ----
            </span>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                className={classes.msBtn}
                // onClick={() => { window.location = `https://${COGNITODOMAIN}.auth.us-east-1.amazoncognito.com/login?client_id=${AWSConfig.aws_user_pools_web_client_id}&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=${HOSTURL}` }}
                onClick={() => {
                  window.location = `https://${COGNITODOMAIN}.auth.${REGION}.amazoncognito.com/oauth2/authorize?identity_provider=${MS_SAML}&redirect_uri=${HOSTURL}&response_type=TOKEN&client_id=${AWSConfig.aws_user_pools_web_client_id}&scope=aws.cognito.signin.user.admin%20email%20openid%20profile`;
                }}
              >
                <i
                  className="fab fa-windows"
                  style={{ fontSize: "2.1rem", marginRight: "10px" }}
                ></i>
                SignIn With Microsoft
              </Button>
            </div>
          </div>
          <small
            style={{
              marginBottom: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            MyShare (c) 2021 | Terms of Use | Security and Privacy
          </small>
        </CCol>
      </CRow>
    </div>
  );
};

export default Login;
