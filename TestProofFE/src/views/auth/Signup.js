import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  // CInput,
  CInput,
  CRow,
  CImg,
  CContainer,
  CCardGroup,
} from '@coreui/react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux';
import { userService, packageService } from '../../controllers/_services';
import { successNotification, warningNotification } from '../../controllers/_helpers';
import { useHistory } from 'react-router-dom';

const validationSchema = function (values) {
  return Yup.object().shape({
    username: Yup.string()
    .min(6, `Username has to be at least 6 characters`)
    .required('Username is required'),
    email: Yup.string()
    .email('Invalid email address')
    .required('Email is required!'),
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
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  package: ""
}

const Signup = () => {
  const dispatch = useDispatch()
  const history = useHistory();

  const [options, setOptions] = useState([1,2,3])
  const [pack, setPack] = useState('')

  useEffect(() => {
    window.hs = history
    setOptions([4,5,6])
    packageService.getOptions()
    .then(data => {
      console.log(data)

      let optionList = data.map(item => {
        return item['fields']['name']
      })
      console.log(optionList)
      setOptions(optionList)
      if(optionList.length > 0) setPack(optionList[0])
      // setTimeout(()=>test(), 2000)
    })
  }, [])
  let gotoSignin = () =>{
    history.push('signin')
  }
  let test = () => {
    // let flag = confirm('do you signup with faker')
    // console.log('test')
    alert('test')
    let username = Math.random()
    let email = Math.random() + "@gmail.com"
    let password = "Alex123123"
    let confirmPassword = "Alex123123"

    userService.register({
      "username": username,
      "email": email,
      "password": password,
      "package" : pack
    })
    .then(
        user => {
          console.log(user)
          if (user && user.status) {
            successNotification(user.message, 3000);
            history.push("signin")
            // gotoSignin()
            // console.log(history)
          } else {
            warningNotification(user.message, 3000);
          }
        },
        error => {
            warningNotification(error, 3000);
        }
    );
  }
  const onSubmit = (values, { setSubmitting, setErrors }) => {
      // console.log('User has been successfully saved!', values)
    setSubmitting(false)
    console.log(values)
    console.log(pack)
    userService.register({
        "username": values.username,
        "email": values.email,
        "password": values.password,
        "package" : pack
      })
      .then(
          user => {
            if (user && user.status) {
              // successNotification(user.message, 3000);
              history.push("signin")
              // console.log(history)
            } else {
              warningNotification(user.message, 3000);
            }
          },
          error => {
              warningNotification(error, 3000);
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
                    <h2 className="text-center signin-header-title">Sign Up to TestProof</h2>

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
                                          name="username"
                                          id="username"
                                          placeholder="Username"
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
                                  <CInput type="email"
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
                                <CFormGroup>
                                  <select className='form-control is-invalid' onChange={(e) => {setPack(e.target.value)}}>
                                    {
                                      options.map((item, key) => <option value={item} key={key}>{item}</option>)
                                    }
                                  </select>
                                
                                  <CInvalidFeedback>{errors.package}</CInvalidFeedback>
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

                                  <CButton type="submit" className="signin-button mt-3" block disabled={isSubmitting || !isValid}>
                                    SIGN UP
                                  </CButton>

                                </CFormGroup>
                              </CForm>
                            </CCol>
                          </CRow>
                        )}
                    </Formik>
                  
                    <h5 className="text-center signin-header-desc">Already have an account? <span className="span-underline" onClick={() => { history.push("signin") }}>Login to TestProof</span></h5>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Signup
