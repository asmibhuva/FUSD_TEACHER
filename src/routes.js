import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Engagement = React.lazy(() =>
  import("./views/dashboard/Components/Engagement/Engagement")
);
const MentalHealth = React.lazy(() =>
  import("./views/dashboard/Components/MentalHealth/MentalHealth")
);
const Safety = React.lazy(() =>
  import("./views/dashboard/Components/Safety/Safety")
);
const StudentAnswers = React.lazy(() =>
  import("./views/dashboard/Components/StudentAnswers/StudentAnswers")
);
const GradeAnswers = React.lazy(() =>
  import("./views/dashboard/Components/GradeAnswers/GradeAnswers")
);
const QALibrary = React.lazy(() =>
  import("./views/dashboard/Components/QALibrary/QALibrary")
);

const routes = [
  { path: "/", exact: true, name: "Login", component: Login },
  { path: "/overview", exact: true, name: "OverView", component: Dashboard },
  {
    path: "/engagement",
    exact: true,
    name: "Engagement",
    component: Engagement,
  },
  {
    path: "/mentalHealth",
    exact: true,
    name: "MentalHealth",
    component: MentalHealth,
  },
  { path: "/safety", exact: true, name: "Safety", component: Safety },
  {
    path: "/gradeAnswers",
    exact: true,
    name: "GradeAnswers",
    component: StudentAnswers,
  },
  {
    path: "/studentAnswers",
    exact: true,
    name: "StudentAnswers",
    component: GradeAnswers,
  },
  { path: "/qaLibrary", exact: true, name: "qaLibrary", component: QALibrary },
];

export default routes;
