import React, { useState, useEffect } from 'react'
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
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../../controllers/_services/user.service';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';



const validationSchema = function (values) {
  return Yup.object().shape({
    code: Yup.string()
    .required('Code is required'),
    password: Yup.string()
    .min(7, `Password has to be at least ${7} characters!`)
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}/, 'Password must contain: numbers, uppercase and lowercase letters\n')
    .required('Password is required'),
    confirmPassword: Yup.string()
    .oneOf([values.password], 'Passwords must match')
    .required('Password confirmation is required')
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

const Signup = () => {
  const dispatch = useDispatch()
  
  const selectedUser = useSelector(state => state.selectedUser);
  const history = useHistory()

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    if (selectedUser && JSON.stringify(selectedUser) !== '{}')
    userService.forgotPassword({
      "code": values.code,
      "email": selectedUser.email,
      "password": values.password
    })
        .then(
            user => { 
                if (user.status) {
                  successNotification("Your password is changed successfully.", 3000);
                  onClose()
                }
                else {
                  warningNotification(user.message, 3000);
                }
            },
            error => {
                warningNotification(error, 3000);
            }
        );    
  }

  const onClose = () => {
    dispatch({type: 'set', openEmailVerification: false})
    dispatch({type: 'set', forgotPassword1: false})
    dispatch({type: 'set', forgotPassword2: false})
  }

  return (
    <>
      <CWidgetSimple className="signin-widget text-left p-3 pt-0 pb-0 mx-auto">
        <div className="float-right" style={{marginRight: '-10px'}}>
          <CImg src={'img/icons8-close.png'} style={{cursor: 'pointer'}} onClick={() => onClose()}></CImg>
        </div>
        <h2 className="text-left signin-header-title">Forgot password?</h2>
        <h5 className="text-left signin-header-desc">Please confirm your email and then reset your password.</h5>

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
                                name="code"
                                id="code"
                                placeholder="Confirm Code"
                                autoComplete="code"
                                valid={!errors.code}
                                invalid={touched.code && !!errors.code}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.code} />
                        <CInvalidFeedback>{errors.code}</CInvalidFeedback>
                      </CFormGroup>
                      <CFormGroup>
                        <CInput type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                valid={!errors.password}
                                invalid={touched.password && !!errors.password}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password} />
                        {/*<CInvalidFeedback>Required password containing at least: number, uppercase and lowercase letter, 8 characters</CInvalidFeedback>*/}
                        <CInvalidFeedback>{errors.password}</CInvalidFeedback>
                      </CFormGroup>
                      <CFormGroup>
                        <CInput type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Repeat password"
                                autoComplete="new-password"
                                valid={!errors.confirmPassword}
                                invalid={touched.confirmPassword && !!errors.confirmPassword}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmPassword} />
                        <CInvalidFeedback>{errors.confirmPassword}</CInvalidFeedback>
                      </CFormGroup>
                      
                      <CFormGroup>

                        <CButton type="submit" className="signin-button mt-3" block disabled={isSubmitting || submitButtonDisabled || !isValid}>
                            Reset your password
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

export default Signup
