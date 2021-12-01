import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CImg,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useHistory } from 'react-router-dom';
import { userService } from '../controllers/_services/user.service';

const TheHeader = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  // const darkMode = useSelector(state => state.darkMode)
  // const sidebarShow = useSelector(state => state.sidebarShow)
  const isLogin = useSelector(state => state.isLogin)
  const isAdmin = useSelector(state => state.isAdmin)
  const currPath = history.location.pathname

  const [fullName, setFullName] = useState('')

  const localUser = localStorage.getItem('userId')
  const user = useSelector(state => state.user)

  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (localUser) {
      userService.getById(parseInt(localUser))
        .then(
          result => {
            // if (result.is_active === 0) logout()
            dispatch({type: 'set', isLogin: true})
            dispatch({type: 'set', user: result})
            // if (result.is_superuser === 1) dispatch({type: 'set', isAdmin: true})
          },
          error => {
            // logout()
          }
        )
    }
    else {
      history.push("signin")
    }
  }, [localUser])

  useEffect(() => {
    if (!user.fullName)
      setFullName(user.username);
    else setFullName(user.fullName)
  }, [user])

  const logout = () => {
    userService.logout();
    dispatch({type: 'set', isLogin: false})
    dispatch({type: 'set', isAdmin: false})
    dispatch({type: 'set', user: {}})
    dispatch({type: 'refresh'})
    history.push("signin")
  }

  const onClickLogo = () => {
    history.push('/home')
  }

  const shouldShowDashboard = isLogin && (['Employee', 'Wholesaler', 'Retailer'].includes(user.role) || isAdmin)

  return (
    <>
    <CHeader colorscheme="dark" className="header">

      <CHeaderNav >
        <CHeaderNavItem >
          <CHeaderNavLink onClick={onClickLogo}>
            <h2>TestProof</h2>
          </CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav className="mr-auto">
        {shouldShowDashboard && <CDropdown variant="btn-group">
            <CDropdownToggle className="m-0 pt-0 p-0 dropdown-toggle-exchange" color="success" caret={false}>Dashboard
              <CImg src={'img/icons8-white-expand-arrow-24.png'} alt="Search" height={24}></CImg>
            </CDropdownToggle>
            <CDropdownMenu className="pt-1 dropdown-toggle-menu" placement="bottom-end">
              <CDropdownItem className={isLogin && isAdmin ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('dashboard-1')}>Dashboard 1</CDropdownItem>
              <CDropdownItem className={isLogin && isAdmin ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('dashboard-2')}>Dashboard 2</CDropdownItem>
              <CDropdownItem className={isLogin && isAdmin ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('dashboard-3')}>Dashboard 3</CDropdownItem>
              <CDropdownItem className={isLogin && isAdmin ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('dashboard-4')}>Dashboard 4</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>}
        <CHeaderNavItem className={isLogin && isAdmin ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/users" className={currPath === '/users' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>User Manage</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && isAdmin ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/links" className={currPath === '/links' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Link Manage</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className={isLogin && !isAdmin ? 'px-3 d-md-down-none' : 'd-none'}>
          <CHeaderNavLink to="/setting" className={currPath === '/setting' ? 'menu-item-active' : 'dropdown-toggle-exchange'}>Setting</CHeaderNavLink>
        </CHeaderNavItem>
      </CHeaderNav>

      <CHeaderNav  className="px-3">
        {/* <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={() => dispatch({type: 'set', darkMode: !darkMode})}
          title="Toggle Light/Dark Mode"
        >
          <CIcon name="cil-moon" className="c-d-dark-none" alt="CoreUI Icons Moon" />
          <CIcon name="cil-sun" className="c-d-default-none" alt="CoreUI Icons Sun" />
        </CToggler> */}
        {/* <TheHeaderDropdownNotif/>
        <TheHeaderDropdownTasks/>
        <TheHeaderDropdownMssg/>
        <TheHeaderDropdown/> */}

        <CDropdown variant="btn-group" className={isLogin ? 'm-0 pt-0' : 'd-none'} toggle={toggle.toString()}
          onFocus={() => setToggle(!toggle)}
          onBlur={() => setToggle(!toggle)}>
            <CDropdownToggle className="m-0 pt-0 p-0 dropdown-toggle-exchange" color="success" caret={false}>
                {fullName}
                { !toggle ?
                    <CImg src={'img/icons8-white-expand-arrow-24.png'} alt="Search" height={24}></CImg>
                :
                    <CImg src={'img/icons8-white-collapse-arrow-24.png'} alt="Search" height={24}></CImg>
                }
            </CDropdownToggle>
            <CDropdownMenu className="pt-1 dropdown-toggle-menu" placement="bottom-end">
                <CDropdownItem className={isLogin && isAdmin ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('users')}>User Manage</CDropdownItem>
                <CDropdownItem className={isLogin && isAdmin ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('links')}>Link Manage</CDropdownItem>
                <CDropdownItem className={isLogin ? 'dropdown-toggle-menuitem' : 'd-none'} onClick={() => history.push('setting')}>Setting</CDropdownItem>
                <CDropdownItem className="dropdown-toggle-menuitem" onClick={logout}>Log out</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
      </CHeaderNav>
    </CHeader>
    </>
  )
}

export default TheHeader
