import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import {
  TheContent,
  TheFooter,
  TheHeader,
  TheSidebar
} from './index'
import ThemeProvider from '../contexts/ThemeContext'

const TheLayout = (props) => {
  const darkMode = useSelector(state => state.darkMode)
  const classes = classNames(
    'c-app c-default-layout',
    darkMode && 'c-dark-theme'
  )

  return (
    <ThemeProvider>
      <div className={classes}>
        {/* <TheHeader/> */}
        <TheSidebar/>
        <div className="c-wrapper" style={{backgroundColor: 'white'}}>
          <div className="c-body">
            <TheContent/>
          </div>
          {/* <TheFooter/> */}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default TheLayout
