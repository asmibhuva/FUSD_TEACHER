import React from "react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EditIcon from "@material-ui/icons/Edit";
import GradeOutlinedIcon from "@material-ui/icons/GradeOutlined";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "OVERVIEW",
    to: "/overview",
    icon: <DashboardIcon className="c-sidebar-nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: "CSidebarNavItem",
    name: "GRADE ANSWERS",
    to: "/gradeAnswers",
    icon: <GradeOutlinedIcon className="c-sidebar-nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: "CSidebarNavItem",
    name: "STUDENT ANSWERS",
    to: "/studentAnswers",
    icon: <EditIcon className="c-sidebar-nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: "CSidebarNavItem",
    name: "Q/A LIBRARY",
    to: "/qaLibrary",
    icon: <LocalLibraryIcon className="c-sidebar-nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Theme']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: 'cil-drop',
  // },
];

export default _nav;
