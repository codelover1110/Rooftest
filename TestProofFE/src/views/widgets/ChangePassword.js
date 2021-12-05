import React, { lazy, useState, useEffect } from 'react'
import {
  CCard,
  CButton,
  CCardBody,
  CInput,
  CFormGroup,
  CFormText,
} from '@coreui/react'
import TextField from '@material-ui/core/TextField'
import { alpha, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { format } from 'date-fns'
import { userService } from '../../controllers/_services'
import {
  successNotification,
  warningNotification,
} from '../../controllers/_helpers'

const useStylesReddit = makeStyles((theme) => ({
  root: {
    border: 'none',
    overflow: 'hidden',
    backgroundColor: '#fcfcfb',
    fontWeight: '700',
    lineHeight: 1.5,
    fontSize: '1rem',
    color: 'black',
    border: '1px solid gray !important',
    boxShadow: 'none !important',
    backgroundImage: 'none !important',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#fff',
    },
    '&$focused': {
      borderRadius: 4,
      color: 'black',
    },
  },
  focused: {},
}))

// id="old-password"
// placeholder="Old password"
// value={oldPassword}
// helperText={
//   errMessageForOldPassword && errMessageForOldPassword !== ''
// 	? errMessageForOldPassword
// 	: ''
// }
// error={errMessageForOldPassword && errMessageForOldPassword !== ''}
// InputLabelProps={{
//   shrink: true,
// }}
// type="password"
// fullWidth
// variant="filled"
// onBlur={handleBlurOldPassword}
// onFocus={handleBlurOldPassword}
// onChange={(e) => {

function RedditTextField({
  id = '',
  placeholder = '',
  value = '',
  helperText = '',
  error = '',
  type = '',
  onBlur = () => {},
  onChange = () => {},
  ...props
}) {
  const classes = useStylesReddit()
  const tmp = (
    <CFormGroup>
      <CInput placeholder={placeholder} />
      <CFormText className="help-block">{helperText}</CFormText>
    </CFormGroup>
  )

  return <CInput />
}

const ChangePassword = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const user = useSelector((state) => state.user)

  const [errMessageForOldPassword, setErrMessageForOldPassword] = useState('')
  const [errMessageForNewPassword, setErrMessageForNewPassword] = useState('')
  const [
    errMessageForConfirmPassword,
    setErrMessageForConfirmPassword,
  ] = useState('')
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const handleBlurOldPassword = () => {
    console.log('here')
    if (!oldPassword || oldPassword === '')
      setErrMessageForOldPassword('Old password is required.')
    else {
      setErrMessageForOldPassword('')
      if (
        errMessageForNewPassword === '' &&
        errMessageForConfirmPassword === '' &&
        newPassword !== '' &&
        newPassword === confirmPassword
      ) {
        setSubmitButtonDisabled(false)
      } else {
        setSubmitButtonDisabled(true)
      }
    }
  }

  const handleBlurNewPassword = (e) => {
    const keyV = e.target.value
    setNewPassword(keyV)
    if (!keyV || keyV === '')
      setErrMessageForNewPassword('New password is required')
    else if (keyV.length < 6)
      setErrMessageForNewPassword('Password have to be at least 6 characters!')
    else if (!keyV.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/))
      setErrMessageForNewPassword(
        'Password must contain: numbers, uppercase and lowercase letters',
      )
    else {
      setErrMessageForNewPassword('')
      if (
        errMessageForOldPassword === '' &&
        errMessageForConfirmPassword === '' &&
        keyV === confirmPassword &&
        oldPassword !== ''
      ) {
        setSubmitButtonDisabled(false)
      } else {
        setSubmitButtonDisabled(true)
      }

      if (keyV !== confirmPassword) {
        setErrMessageForConfirmPassword('Passwords must match')
      }
    }
  }

  const handleBlurConfirmPassword = (e) => {
    const keyV = e.target.value
    setConfirmPassword(keyV)
    if (keyV !== newPassword)
      setErrMessageForConfirmPassword('Passwords must match')
    else {
      setErrMessageForConfirmPassword('')
      if (
        errMessageForOldPassword === '' &&
        errMessageForNewPassword === '' &&
        newPassword !== '' &&
        keyV === newPassword &&
        oldPassword !== ''
      ) {
        setSubmitButtonDisabled(false)
      } else {
        setSubmitButtonDisabled(true)
      }
    }
  }

  const onSubmit = () => {
    if (user && JSON.stringify(user) !== '{}') {
      console.log(user)

      setIsSubmitting(true)
      userService
        .updatePassword({
          id: user.id,
          oldPassword: oldPassword,
          password: newPassword,
        })
        .then(
          (result) => {
            console.log(result)
            successNotification('Successfully password changed!', 3000)
            setIsSubmitting(false)
          },
          (error) => {
            console.log(error)
            warningNotification(error, 3000)
            setIsSubmitting(false)
          },
        )
    }
  }
  // render
  return (
    <CCard
      color="transparent"
      className="d-box-shadow1 d-border"
      style={{
        paddingTop: '29px',
        paddingRight: '36px',
        paddingLeft: '36px',
        paddingBottom: '0px',
        borderRadius: '5px',
      }}
    >
      <CFormGroup>
        <CInput
          className="help-block"
          id="old-password"
          placeholder="Old password"
          value={oldPassword}
          error={errMessageForOldPassword && errMessageForOldPassword !== ''}
          type="password"
          fullWidth
          variant="filled"
          onBlur={handleBlurOldPassword}
          onFocus={handleBlurOldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value)
            handleBlurOldPassword()
          }}
        />
        <div style={{ color: '#e55353' }}>
          {errMessageForOldPassword && errMessageForOldPassword !== ''
            ? errMessageForOldPassword
            : ''}
        </div>
      </CFormGroup>

      <CFormGroup>
        <CInput
          className="help-block"
          id="new-password"
          placeholder="New password"
          value={newPassword}
          error={errMessageForOldPassword && errMessageForOldPassword !== ''}
          type="password"
          onBlur={handleBlurNewPassword}
          onFocus={handleBlurNewPassword}
          onChange={
            handleBlurNewPassword
          }
        />
        <div style={{ color: '#e55353' }}>
          {errMessageForNewPassword && errMessageForNewPassword !== ''
                ? errMessageForNewPassword
                : ''}
        </div>
      </CFormGroup>

	  <CFormGroup>
        <CInput
          className="help-block"
		  id="confirm-password"
		  placeholder="Repeat new password"
          value={confirmPassword}
          error={errMessageForConfirmPassword && errMessageForConfirmPassword !== ''}
          type="password"
          onChange={
            handleBlurConfirmPassword
          }
        />
        <div style={{ color: '#e55353' }}>
          {errMessageForConfirmPassword &&
              errMessageForConfirmPassword !== ''
                ? errMessageForConfirmPassword
                : ''}
        </div>
      </CFormGroup>

      <div className="d-flex mt-0 float-right">
        <CButton
          className="button-exchange"
          onClick={() => onSubmit()}
          disabled={submitButtonDisabled}
        >
          {isSubmitting ? 'Wait...' : 'Change'}
        </CButton>
      </div>
    </CCard>
  )
}

export default ChangePassword
