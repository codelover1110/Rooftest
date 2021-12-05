import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CInvalidFeedback,
  CModal,
  CModalBody,
  CRow,
} from '@coreui/react'
import { Card, CardContent } from '@material-ui/core'
import { Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import PictureUpload from '../../components/PictureUpload'
import defaultImage from '../../assets/imgs/default-avatar.png'
import ChangePassword from '../widgets/ChangePassword'
import {
  successNotification,
  warningNotification,
} from '../../controllers/_helpers'
import { userService } from '../../controllers/_services'

const validationSchema = function (values) {
  return Yup.object().shape({
    fullName: Yup.string()
      .min(3, 'Full Name should be over 3 letters')
      .required('Full Name is required'),
    title: Yup.string().required('Title is required'),
    username: Yup.string().required('User name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
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
  // const user = useSelector((state) => state.user)
  const user = JSON.parse(localStorage.getItem('user'))
  const initialValues = {
    username: '',
    email: '',
    password: '',
    title: '',
    fullName: '',
  }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateUser, setUpdateUser] = useState(initialValues)
  const changePassword = useSelector(state => state.changePassword)
  useEffect(() => {
    dispatch({ type: 'set', darkMode: false })
    if (!localStorage.getItem('userId') || !user) {
      dispatch({ type: 'set', darkMode: true })
      history.push('/home')
    }
  }, [])

  useMemo(() => {
    setUpdateUser((prevState = initialValues) => ({
      ...(prevState ?? initialValues),
      username: user?.username ?? '',
      email: user?.email ?? '',
      title: user?.title ?? '',
      fullName: user?.fullName ?? '',
    }))
  }, [])
  const [file, setFile] = React.useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(defaultImage)
  const handleImageChange = (e) => {
    e.preventDefault()
    let reader = new FileReader()
    let newFile = e.target.files[0]
    reader.onloadend = () => {
      setFile(newFile)
      setImagePreviewUrl(reader.result)
    }
    if (newFile) {
      reader.readAsDataURL(newFile)
    }
  }
  const onSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(false)
    if (user) {
      const newUser = {
        ...user,
        ...values,
      }

      setIsSubmitting(true)
      userService.update(newUser, file).then(
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
  
  const openChangePassword = () => {
    dispatch({ type: 'set', changePassword: true })
  }

  const handleClose = () => {
    dispatch({type: 'set', changePassword: false})
  };

  return (
    <CContainer>
      <h1 style={{ color: '#004E79', textAlign: 'center' }}>
        Profile Settings
      </h1>
      <Card style={{ maxWidth: '640px', margin: 'auto' }}>
        <CardContent style={{ maxWidth: '456px', margin: 'auto' }}>
          <Formik
            initialValues={updateUser}
            validate={validate(validationSchema)}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <CRow>
                <CCol lg="12">
                  <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                    <PictureUpload
                      imagePreviewUrl={imagePreviewUrl}
                      handleImageChange={handleImageChange}
                    />
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
                      <CInvalidFeedback>{errors.fullName}</CInvalidFeedback>
                    </CFormGroup>
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
                      <CInvalidFeedback>{errors.title}</CInvalidFeedback>
                    </CFormGroup>
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.username}
                      />
                      <CInvalidFeedback>{errors.username}</CInvalidFeedback>
                    </CFormGroup>
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
                      <CInvalidFeedback>{errors.email}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CButton
                        type="button"
                        className="signin-button mt-3"
                        block
                        onClick={openChangePassword}
                        style={{background: "white", color: "gray"}}
                      >
                        Change Password
                      </CButton>
                    </CFormGroup>
                    <CFormGroup>
                      <CButton
                        type="submit"
                        className="signin-button mt-3"
                        block
                        // disabled={isSubmitting || !isValid}
                      >
                        Save Changes
                      </CButton>
                    </CFormGroup>
                  </CForm>
                </CCol>
              </CRow>
            )}
          </Formik>
        </CardContent>
      </Card>
      <CModal 
        show={changePassword} 
        className="p-0 auth-modal m-auto justify-content-center"
        onClose={handleClose}
        centered
        // size={forgotPassword1 || forgotPassword2 ? '' : 'sm' }
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          maxWidth: '450px',
          margin: 'auto',
        }}
        >
        <CModalBody className="p-0">
          <>
            <ChangePassword />
          </>
        </CModalBody>
    </CModal>
    </CContainer>
  )
}

export default PersionalSetting
