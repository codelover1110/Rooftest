import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg,
  CRow,
  CCol,
  CNavItem
} from '@coreui/react'
import { useHistory } from 'react-router-dom';
import { userService } from '../controllers/_services/user.service';
// sidebar nav config
import navigation from './_nav'
import { useConfig } from "../config";
const config = useConfig()


const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const history = useHistory()
  const user = useSelector((state) => state.user)

  const logout = () => {
    userService.logout();
    dispatch({type: 'set', isLogin: false})
    dispatch({type: 'set', isAdmin: false})
    dispatch({type: 'set', user: {}})
    dispatch({type: 'refresh'})
    history.push("signin")
  }

  return (
    <CSidebar
      // show={show}
      unfoldable
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
      style={{
        backgroundColor: '#C8ECFF',
        fontFamily: 'PoppinsM',
      }}
    >
      <CSidebarBrand className="d-md-down-none visible" to="/">
        <CImg
            src={'img/logo.png'}
            alt="Company Logo"
            height="100"
          />
      </CSidebarBrand>

      <CSidebarBrand className="d-md-down-none visible" style={{
        marginTop: "50px",
        marginBottom: "50px"
      }}>
        <div style={{display: 'flex'}}>
          <CImg style={{width: 50, height: 50, borderRadius: '50%', marginRight: 7}} src={(user && user.avatar) ? `${config.serverUrl}/media${user.avatar}`:'img/avatar.png'} height="50"></CImg>
          <div style={{width: 'calc(100% - 40px)'}} className="sidebar-avatar">
            <h5>{user && user.title}</h5>
            <p>{user && user.fullName}</p>
          </div>
        </div>
      </CSidebarBrand>

      <CSidebarNav>

        {/* <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        /> */}
        { navigation.map(({name, to, icon,}) => (
          <>
            <CSidebarNavDivider />
            <CSidebarNavItem to={to} name={name} icon={<CImg src={icon} style={{height: 30, paddingRight: 5}}/>} />
          </>
        ))
          
        }

      </CSidebarNav>

      <CSidebarBrand className="d-md-down-none visible">
        <h4 className="sidebar-logout" onClick={logout}>LOGOUT</h4>
      </CSidebarBrand>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
