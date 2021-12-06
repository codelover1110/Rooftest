import React, { lazy, useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CInput,
  CFormGroup,
  CButton,
  CContainer,
  CForm,
} from '@coreui/react'
import * as Yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Box, Card, CardContent, Grid } from '@material-ui/core'
import PictureUpload from '../../components/PictureUpload'
import { userService } from '../../controllers/_services'
import { Formik } from 'formik'
import { successNotification, warningNotification } from '../../controllers/_helpers';

const validationSchema = function (values) {
  return Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().required('Title is required'),
    title: Yup.string().required('User name is required'),
  })
}

const validationSchemaWithPassword = function (values) {
  return Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().required('Title is required'),
    title: Yup.string().required('User name is required'),
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string().required('New password is required'),
    confirmPassword: Yup.string().required('New password is required'),
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



const PersionalSetting = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state) => state.user)

  const [initialValues, setInitialValues] = useState(null)
  const [avatar, setAvatar] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    dispatch({ type: 'set', darkMode: false })
    if (!localStorage.getItem('userId') || !user) {
      dispatch({ type: 'set', darkMode: true })
      history.push('/home')
    }
  }, [])

  useEffect(() => {
    const { username, fullName, title, email } = user;
    setInitialValues({ username, fullName, title, email });
  }, [user])

  //  # Med ID, Address 1, Address 2, City, Zip, Phone Number, Last Purchase Date
  const fields = [
    {
      id: 'full-name',
      jsonName: 'fullName',
      label: 'Full Name',
    },
  ]
  const onSubmit = (values, { setSubmitting, setErrors }) => {
    const { fullName, username, email, title, oldPassword, newPassword, confirmPassword  } = values;
    if (user) {
      let newUser = {}
      if (!showPassword) {
        newUser = {
          ...user,
          fullName,
          username,
          email,
          title,
        }
      } else {
        if (confirmPassword !== newPassword) {
          warningNotification('Confirm password is incorrect', 3000)
          return
        }
        newUser = {
          ...user,
          fullName,
          username,
          email,
          title,
          oldPassword,
          newPassword,
        }
      }
      if (avatar) {
        newUser['avatarFile'] = avatar;
      }
      setSubmitting(true)
      userService.update(newUser).then(
        (result) => {
          dispatch({ type: 'set', user: result.data })
          successNotification('Updated your profile successfully', 3000)
          setSubmitting(false)
        },
        (error) => {
          warningNotification(error, 3000)
          setSubmitting(false)
        },
      )
    }
  }

  return (
    <CContainer>
      <h1 style={{ color: '#004E79', textAlign: 'center' }}>
        Profile Settings
      </h1>
      <Card style={{ maxWidth: '640px', margin: 'auto' }}>
        <CardContent style={{ maxWidth: '456px', margin: 'auto' }}>
          {initialValues &&
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {({
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
              setTouched,
            }) => (
              <CRow>
                <CCol lg="12">
                  <CForm onSubmit={handleSubmit} name="simpleForm">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <PictureUpload file={avatar} setFile={setAvatar} />
                      </Grid>
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CInput
                            type="text"
                            name="fullName"
                            id="fullName"
                            placeholder="Full Name"
                            autoComplete="fullName"
                            valid={!errors.fullName}
                            invalid={touched.fullName && !!errors.fullName}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.fullName}
                          />
                        </CFormGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CInput
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Title"
                            autoComplete="title"
                            valid={!errors.title}
                            invalid={touched.title && !!errors.title}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title}
                          />
                        </CFormGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CInput
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            autoComplete="username"
                            valid={!errors.username}
                            invalid={touched.username && !!errors.username}
                            required
                            // onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                          />
                        </CFormGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CInput
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            autoComplete="email"
                            valid={!errors.email}
                            invalid={touched.email && !!errors.email}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                          />
                        </CFormGroup>
                      </Grid>
                      { !showPassword ?
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CButton
                            className="change-password-button m-0 mt-3"
                            block
                            onClick={() => setShowPassword(true)}
                          >
                            Change Password
                          </CButton>
                        </CFormGroup>
                      </Grid>
                      :
                      (<>
                        <Grid item xs={12}>
                          <CFormGroup>
                            <CInput
                              type="password"
                              name="oldPassword"
                              id="oldPassword"
                              placeholder="Old Password"
                              valid={!errors.oldPassword}
                              invalid={touched.oldPassword && !!errors.oldPassword}
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.oldPassword}
                            />
                          </CFormGroup>
                        </Grid>
                        <Grid item xs={12}>
                          <CFormGroup>
                            <CInput
                              type="password"
                              name="newPassword"
                              id="newPassword"
                              placeholder="New Password"
                              autoComplete="newPassword"
                              valid={!errors.newPassword}
                              invalid={touched.newPassword && !!errors.newPassword}
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.newPassword}
                            />
                          </CFormGroup>
                        </Grid>
                        <Grid item xs={12}>
                          <CFormGroup>
                            <CInput
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              placeholder="Confirm New Password"
                              autoComplete="confirmPassword"
                              valid={!errors.confirmPassword}
                              invalid={touched.confirmPassword && !!errors.confirmPassword}
                              required
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.confirmPassword}
                            />
                          </CFormGroup>
                        </Grid>
                      </>)
                      }
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CButton
                            type="submit"
                            className="signin-button mt-3"
                            block
                            disabled={isSubmitting || !isValid}
                          >
                            Save Changes
                          </CButton>
                        </CFormGroup>
                      </Grid>
                    </Grid>
                  </CForm>
                </CCol>
              </CRow>
            )}
          </Formik>
          }
        </CardContent>
      </Card>
    </CContainer>
  )
}

export default PersionalSetting
