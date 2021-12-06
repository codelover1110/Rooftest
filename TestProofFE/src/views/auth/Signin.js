import {
  CButton,
  CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormGroup, CImg, CInput, CInvalidFeedback, CRow
} from '@coreui/react';
import { Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import { userService } from '../../controllers/_services';

const AuthDialog = React.lazy(() => import('../../views/auth/AuthDialog'));

const validationSchema = function (values) {
  return Yup.object().shape({
    username: Yup.string()
    .required('Username or Email is required'),
    password: Yup.string()
    .required('Password is required'),
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
  username: "",
  password: ""
}

const Signin = () => {
  const dispatch = useDispatch()
  const history = useHistory();

  const onSubmit = (values, { setSubmitting, setErrors }) => {
      // console.log('User has been successfully saved!', values)
    setSubmitting(false)
  
    userService.login(values.username, values.password, true)
      .then(
        result => {
          if (result.status)  {
            dispatch({type: 'set', isLogin: true})
            dispatch({type: 'set', user: result.data})
            successNotification('Welcome to TestProof', 3000)
            history.push('home')
          }
          else {

            warningNotification(result.message, 3000)
            // dispatch({type: 'set', selectedUser: {
            //   "email": values.email,
            //   "password": values.password
            // }})
            // dispatch({type: 'set', openEmailVerification: true})
          }
        },
        error => {
          console.log(error);

          warningNotification(error, 3000)
        }
      );
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center bg-signin">
      <CContainer>
        <div>
          <CImg src={'img/logo.png'} className="sign-logo"></CImg>
        </div>
        <CRow className="justify-content-center">
          <CCol md="12">
            <CCardGroup className="m-auto" style={{
                overflow: "hidden",
                maxWidth: '380px'
              }}>
              <CCard className="p-3" style={{backgroundColor: "#EAEAEA", borderRadius: "15px", boxShadow: "none"}}>
                <CCardBody style={{padding: "30px"}}>
                  <div className="text-left pt-0 pb-0 mx-auto">
                    <h2 className="text-center signin-header-title">Welcome to TestProof</h2>

                    <Formik
                      initialValues={initialValues}
                      // validate={validate(validationSchema)}
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
                                          name="username"
                                          id="username"
                                          placeholder="Username or Email"
                                          autoComplete="username"
                                          valid={!errors.username}
                                          invalid={touched.username && !!errors.username}
                                          required
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          value={values.username} />
                                  <CInvalidFeedback>{errors.username}</CInvalidFeedback>
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

                                <h5 className="text-center signin-header-desc mt-0">Forgot Password? <span className="span-underline" onClick={() => {
                                    dispatch({type: 'set', openSignin: false})
                                    dispatch({type: 'set', openSignup: false})
                                    dispatch({type: 'set', forgotPassword1: true})
                                  }}>
                                    Click here
                                    </span>
                                </h5>
                                
                                <CFormGroup className="pt-1">

                                  <CButton type="submit" className="signin-button mt-3" block disabled={isSubmitting || !isValid}>
                                    LOG IN
                                  </CButton>

                                </CFormGroup>
                              </CForm>
                            </CCol>
                          </CRow>
                        )}
                    </Formik>
                  
                    <h5 className="text-center signin-header-desc">Don't have an account? <span className="span-underline" onClick={() => { history.push("signup") }}>Sign Up to TestProof</span></h5>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <AuthDialog />
    </div>
  )
}

export default Signin
