import React, { lazy, useEffect, useState } from 'react'
import {
  CRow,
  CCol
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const PersionalInfoSetting = lazy(() => import('../widgets/PersionalInfoSetting'))

const PersionalSetting = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  const user = useSelector(state => state.user)

  if (!localStorage.getItem('userId') || !user) {
    dispatch({type: 'set', darkMode: true})
    history.push('/home')
  }

  return (
    <>
      <PersionalInfoSetting />
    </>
  )
}

export default PersionalSetting
