import React from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'


// sidebar nav config
import navigation from './_nav'


import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { SideBarSlice } from 'src/__redux/SideBar/SideBarSlice';

const useStyles = makeStyles(theme => ({
  brand: {
    backgroundColor: '#3C4B64',
    border: 0,
    color: 'white',
    textTransform: "uppercase",
    display: "flex",
    height: "57px",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
    fontSize: "24px",
    // padding: '0 40px',
    [theme.breakpoints.down('sm')]: {
      // padding: '0 10px',
      fontSize: "20px",
    },
    [theme.breakpoints.up('md')]: {
      // padding: '0 20px',
      fontSize: "24px",
    },
    [theme.breakpoints.up('lg')]: {
      // padding: '10px 0px',
      fontSize: "24px",
    },
  },
}));

const TheSidebar = () => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const history = useHistory();
  const { actions: sidebarShowActions } = SideBarSlice;

  const { sidebarShow } = useSelector(
    (state) => ({
      sidebarShow: state.sidebarShow.sidebarShow,
    }),
    shallowEqual
  );

  return (
    <CSidebar
      show={sidebarShow}
      onShowChange={(val) => dispatch(sidebarShowActions.setSidebarShow(val))}
    >
      <div className={` c-sidebar-brand-full ${classes.brand}`}>
        MY SHARE
      </div>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      {/* <CSidebarMinimizer className="c-d-md-down-none"/> */}
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
