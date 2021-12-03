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
    password: Yup.string().required('Title is required'),
    password: Yup.string().required('User name is required'),
    password: Yup.string().required('Email is required'),
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
  userName: '',
  password: '',
}

const PersionalSetting = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state) => state.user)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fullName, setFullName] = useState()

  useEffect(() => {
    dispatch({ type: 'set', darkMode: false })
    if (!localStorage.getItem('userId') || !user) {
      dispatch({ type: 'set', darkMode: true })
      history.push('/home')
    }
  }, [])

  //  # Med ID, Address 1, Address 2, City, Zip, Phone Number, Last Purchase Date
  const fields = [
    {
      id: 'full-name',
      jsonName: 'fullName',
      label: 'Full Name',
      value: fullName,
      updateValueFunc: setFullName,
    },
  ]
  const onSubmit = () => {
    if (user) {
      let updateFields = {}
      fields.forEach((field) => {
        updateFields[field.jsonName] = field.value
      })

      const newUser = {
        ...user,
        ...updateFields,
      }

      console.log(newUser)
      setIsSubmitting(true)
      userService.update(newUser).then(
        (result) => {
          dispatch({ type: 'set', user: newUser })
          successNotification('Updated your profile successfully', 3000)
          setIsSubmitting(false)
        },
        (error) => {
          warningNotification(error, 3000)
          setIsSubmitting(false)
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
          <Formik
            initialValues={initialValues}
            validate={validate(validationSchema)}
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
                  <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <PictureUpload />
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
                            name="userName"
                            id="userName"
                            placeholder="Username"
                            autoComplete="userName"
                            valid={!errors.userName}
                            invalid={touched.userName && !!errors.userName}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.userName}
                          />
                        </CFormGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CInput
                            type="text"
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
                      <Grid item xs={12}>
                        <CFormGroup>
                          <CInput
                            type="text"
                            name="password"
                            id="password"
                            placeholder="Change Password"
                            autoComplete="password"
                            valid={!errors.password}
                            invalid={touched.password && !!errors.password}
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                        </CFormGroup>
                      </Grid>
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
        </CardContent>
      </Card>
    </CContainer>
  )
}

export default PersionalSetting
