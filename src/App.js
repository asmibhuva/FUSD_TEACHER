import React, { Component, Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  HashRouter,
} from "react-router-dom";
import "./scss/style.scss";
import Amplify, { Auth } from "aws-amplify";
import { CSpinner } from "@coreui/react";
import {
  AWSAppSyncConfig,
  AWSConfig,
  COGNITODOMAIN,
  HOSTURL,
  REGION,
} from "./aws-exports";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AuthSlice } from "./__redux/Auth/AuthSlice";
import { useHistory } from "react-router";

export function parseJwt(token) {
  var base64Url = token?.split(".")[1];
  var base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));

Amplify.configure(AWSConfig);
Auth.configure();
// Amplify.configure(AWSAppSyncConfig);

const App = () => {
  const dispatch = useDispatch();
  const { actions: authActions } = AuthSlice;
  const [authState, setAuthState] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const session = await Auth.currentSession();
      if (session) {
        dispatch(authActions.setIsUserSignedIn(true));
        setAuthState(true);
      } else {
        dispatch(authActions.setIsUserSignedIn(false));
        setAuthState(false);
      }
    })();
  }, []);

  const getHashParams = (hash) => {
    return hash.split("&").reduce(function (res, item) {
      var parts = item.split("=");
      res[parts[0]] = parts[1];
      return res;
    }, {});
  };

  const fetchSessionFromSessionStorage = () => {
    return new Promise((resolve, reject) => {
      const currentActiveSession = sessionStorage.getItem("currentSesion");
      if (currentActiveSession) {
        console.log("Session storage found!");
        return resolve(JSON.parse(currentActiveSession));
      } else {
        // console.log("hash", window.location.hash)
        if (window.location.hash === "#/login") {
          return reject({});
        }
        if (window.location.hash) {
          const hashParams = getHashParams(window.location.hash.substr(1));
          // console.log('hash params',hashParams)
          sessionStorage.setItem(
            "currentSesion",
            JSON.stringify({ ...hashParams, loginMode: "MS" })
          );
          return resolve(JSON.parse(sessionStorage.getItem("currentSesion")));
        }
        console.log("No session storage found!");
        return reject({});
      }
    });
  };

  //JWT tokens decoder

  useEffect(() => {
    (async () => {
      fetchSessionFromSessionStorage()
        .then((d) => {
          console.log("fetchSessionFromSessionStorage -> then");
          const AllowedGroup = parseJwt(d.id_token)[`cognito:groups`].includes(
            process.env.REACT_APP_ALLOWED_GROUPS
          );
          // console.log("AllowedGroup", AllowedGroup);
          if (!AllowedGroup) {
            const currentActiveSession = JSON.parse(
              sessionStorage.getItem("currentSesion")
            );
            if (currentActiveSession?.loginMode === "MS") {
              console.log("Log out from Azure account");
              sessionStorage.clear();
              window.alert(
                "Sorry, there is no teacher profile associated with this account."
              );
              window.location = `https://${COGNITODOMAIN}.auth.${REGION}.amazoncognito.com/logout?client_id=${AWSConfig.aws_user_pools_web_client_id}&logout_uri=${HOSTURL}`;
            }
          }
          setAuthState(true);
          // console.log(d)
        })
        .catch(async (e) => {
          console.log("Amplify login ");
          const session = await Auth.currentSession();
          if (session) {
            console.log("got the session from amplify");
            // console.log("session",session.getIdToken())
            sessionStorage.setItem(
              "currentSesion",
              JSON.stringify({
                id_token: session.getIdToken().jwtToken,
                access_token: session.getAccessToken().jwtToken,
                loginMode: "AMPLIFY",
              })
            );
            setAuthState(true);
          } else {
            setAuthState(false);
          }
        })
        .finally(() => {
          console.log("fetchSessionFromSessionStorage -> finally");
          setSessionChecked(true);
        });
    })();
  }, []);

  useEffect(() => {
    console.log("State Updated");

    if (authState) {
      const currentActiveSession = sessionStorage.getItem("currentSesion");
      // console.log("currentSesion->id_token", JSON.parse(currentActiveSession).id_token)
      const decodedData = parseJwt(JSON.parse(currentActiveSession).id_token);
      // console.log("decodedData", decodedData);
      // Amplify.configure({
      //   graphql_headers: async () => ({
      //     'Authorization': JSON.parse(currentActiveSession).id_token
      //   })
      // });

      Amplify.configure({
        API: {
          graphql_endpoint: AWSAppSyncConfig.aws_appsync_graphqlEndpoint,
          graphql_headers: () => ({
            Authorization: JSON.parse(currentActiveSession).id_token, // Set Custom Request Headers for non-AppSync GraphQL APIs
          }),
        },
      });

      console.log("AmpliFy Updated");
    }
  }, [authState]);
  // console.log(authState)
  // console.log(sessionChecked)

  return (
    <Suspense
      fallback={
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
      }
    >
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            name="Login Page"
            render={(props) => <Login {...props} />}
          />
          <Route
            path="/overview"
            exact
            name="Home"
            render={(props) => <TheLayout {...props} />}
          />
          <Route
            path="/engagement"
            exact
            name="Engagement"
            render={(props) => <TheLayout {...props} />}
          />
          <Route
            path="/mentalHealth"
            exact
            name="MentalHealth"
            render={(props) => <TheLayout {...props} />}
          />
          <Route
            path="/safety"
            exact
            name="Safety"
            render={(props) => <TheLayout {...props} />}
          />
          <Route
            path="/studentAnswers"
            exact
            name="StudentAnswers"
            render={(props) => <TheLayout {...props} />}
          />
          <Route
            path="/gradeAnswers"
            exact
            name="GradeAnswers"
            render={(props) => <TheLayout {...props} />}
          />
          <Route
            path="/qaLibrary"
            exact
            name="qaLibrary"
            render={(props) => <TheLayout {...props} />}
          />
          <Route
            exact
            path="/"
            name="Login Page"
            render={(props) => <Login {...props} />}
          />
          <Route
            exact
            path="*"
            name="Page 404"
            render={(props) => <Page404 {...props} />}
          />
        </Switch>
        {sessionChecked === true ? (
          authState === true ? (
            <Redirect to="/overview" />
          ) : (
            <Redirect to="/login" />
          )
        ) : null}
      </Router>
    </Suspense>
  );
};

export default App;
