import React, { useEffect, useState } from 'react'
import {
  CWidgetSimple,
  CButton,
  CImg,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  CInput,
  CRow
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import { userService } from '../../controllers/_services/user.service';
import { warningNotification } from '../../controllers/_helpers';
import { Formik } from 'formik'
import * as Yup from 'yup'


const validationSchema = function (values) {
  return Yup.object().shape({
    email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
  })
}

const validate = (getValidationSchema) => {
  return (values) => {
    const validationSchema = getValidationSchema(values)
    try {
      validationSchema.validateSync(values, { abortEarly: false })
      return {}
    } catch (error) {
      return getErrorsFromValidationError(error)
    }
  }
}

const getErrorsFromValidationError = (validationError) => {
  const FIRST_ERROR = 0
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR],
    }
  }, {})
}

const initialValues = {
  email: ""
}

const ForgotPassword = () => {
  const dispatch = useDispatch()



  const onClose = () => {
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: false})
    dispatch({type: 'set', forgotPassword2: false})
  }

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    
    userService.forgotPasswordToConfirmEmail(values.email)
      .then(
          result => {
            if (result.status) {
              warningNotification("Please check your email to verify the account.", 3000)
              dispatch({type: 'set', forgotPassword1: false})
              dispatch({type: 'set', forgotPassword2: true})
              dispatch({type: 'set', selectedUser: { "email": values.email }})
            }
            else {
              warningNotification(result.message, 3000)
            }
          },
          error => {
            warningNotification(error, 3000)
          }
      );
  }

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <div className="float-right" style={{marginRight: '-10px'}}>
          <CImg src={'img/icons8-close.png'} style={{cursor: 'pointer'}} onClick={() => onClose()}></CImg>
        </div>
        <h2 className="text-left signin-header-title">Forgot password?</h2>
        <h5 className="text-left signin-header-desc">Please confirm your email.</h5>
        <Formik
          initialValues={initialValues}
          validate={validate(validationSchema)}
          onSubmit={onSubmit}
        >
          {
            ({
              values,
              errors,
              touched,
              status,
              dirty,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              isValid,
              handleReset,
              setTouched
            }) => (
              <CRow>
                <CCol lg="12">
                  <CForm onSubmit={handleSubmit} noValidate name='simpleForm'>
                    <CFormGroup>
                      <CInput type="text"
                              name="email"
                              id="email"
                              placeholder="Email"
                              autoComplete="email"
                              valid={!errors.email}
                              invalid={touched.email && !!errors.email}
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email} />
                      <CInvalidFeedback>{errors.email}</CInvalidFeedback>
                    </CFormGroup>
                    
                    <CFormGroup className="pt-1">

                      <CButton type="submit" className="signin-button mt-3" block disabled={isSubmitting || !isValid}>
                        CONFIRM
                      </CButton>

                    </CFormGroup>
                  </CForm>
                </CCol>
              </CRow>
            )}
        </Formik>
                  
      </CWidgetSimple>
    </>
  )
}

export default ForgotPassword
