import {
  CCard,
  CCardBody,
  CCardHeader
} from '@coreui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Terms = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  dispatch({type: 'set', darkMode: false})

  return (
    <>
      <CCard color="transparent" className="transaction-table d-box-shadow1 d-border p-0 m-0">
        <CCardHeader color="transparent d-border p-0 text-center">
            <h1>Terms of Use</h1>
        </CCardHeader>
        <CCardBody className="p-0" color="default">
        </CCardBody>
      </CCard>

    </>
  )
}

export default Terms
