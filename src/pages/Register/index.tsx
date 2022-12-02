import style from './Register.module.scss';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import {Alert, Button, Checkbox, FormControlLabel} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useRef, useState} from 'react';
import {API_URL} from '../../config';
import axios from 'axios';
import {InfinitySpin} from 'react-loader-spinner';
import {
  passwordSameValidate,
  validateEmail,
  validatePassword,
  validateUsername
} from "../../services/utils/validators";

function RegisterFormSide() {
  const navigate = useNavigate();
  return (
    <div className={style.right__side}>
      <div className={style.buttons__sections}>
        <div>
          <Button
            style={{backgroundColor: '#343A40', borderRadius: '11px'}}
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            style={{backgroundColor: '#0055FF', borderRadius: '11px'}}
            variant="contained"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </div>

      <RegisterForm/>
      <p className={style.form__underline}>
        Already have account
        <span style={{color: '#1E74FD', fontWeight: 'bold'}}
              onClick={() => navigate('/login')}>
          {' '}
          Login
        </span>
      </p>
    </div>
  );
}


type Payload = {
  username?: string
  email?: string
  password?: string
  passwordConfirm?: string
}

function RegisterForm() {
  const navigate = useNavigate();
  const registerForm = useRef<null | HTMLFormElement>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorText, setErrorText] = useState('Something with server was wrong');


  const errorDisable = () => {
    setError(false)
  }

  const handleRegister = () => {
    const form = registerForm.current;
    if (!form) {
      alert('Not Form');
      return;
    }
    if (!form.term.checked) {
      setErrorText('You must accept the terms of the agreement');
      setError(true);
      return;
    }
    const payload: Payload = {};
    try {
      payload.username = validateUsername(form.username.value)
      payload.email = validateEmail(form.email.value)
      payload.password = validatePassword(form.password.value)
      payload.passwordConfirm = validatePassword(form.passwordConfirm.value)
      passwordSameValidate(payload.password, payload.passwordConfirm)
    } catch (err: unknown) {
      if (err instanceof Error) {
        switch (err.message) {
          case "UsernameError":
            setErrorText("The user field is require length must be greater then 4 and not contains space")
            break
          case "EmailError":
            setErrorText("The email field should not be valid, check the correctness of filling")
            break
          case "PasswordError":
            setErrorText("The password field is require length must be not less then 8 and not contains space and not be too common")
            break
          case "PasswordDiffError":
            setErrorText("The password is different")
            break
          default:
            setErrorText(err.message)
        }
        setError(true)
      }
      return;
    }
    setLoading(true);
    console.log(payload)
    axios
      .post(`${API_URL}/api/auth/register/`, payload)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          navigate('/login');
        }
      })
      .catch((reason) => {
        console.log(reason);
        setLoading(false);
        setErrorText('Something with server was wrong');
        setError(true);
      });
  };

  return (
    <div
      className={style.register__form_r}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <p className={style.form__headline}>Create your account</p>
      {isLoading && <InfinitySpin width="200" color="#4fa94d"/>}
      {isError && <Alert severity="error">{errorText}</Alert>}
      <Box
        className={style.form__box}
        sx={{
          width: '35%',
          '& > :not(style)': {m: 1}
        }}
      >
        <form ref={registerForm}>
          <Input
            placeholder="Username"
            onChange={errorDisable}
            id="username"
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle/>
              </InputAdornment>
            }
            fullWidth={true}
          />
          <br/>
          <Input
            placeholder="Email"
            onChange={errorDisable}
            id="email"
            startAdornment={
              <InputAdornment position="start">
                <MailOutlineIcon/>
              </InputAdornment>
            }
            fullWidth={true}
          />
          <br/>
          <Input
            placeholder="Password"
            onChange={errorDisable}
            id="password"
            startAdornment={
              <InputAdornment position="start">
                <LockIcon/>
              </InputAdornment>
            }
            type={'password'}
            fullWidth={true}
          />
          <br/>
          <Input
            placeholder="Confirm password"
            onChange={errorDisable}
            id="passwordConfirm"
            startAdornment={
              <InputAdornment position="start">
                <LockIcon/>
              </InputAdornment>
            }
            type={'password'}
            fullWidth={true}
          />
          <br/>
          <FormControlLabel
            style={{color: '#808383'}}
            control={<Checkbox onChange={errorDisable} id="term"
                               style={{fontSize: '12px'}}
                               name="term"/>}
            label="Accept Term and Conditions"
          />
          <Button
            onClick={handleRegister}
            style={{backgroundColor: '#343A40', borderRadius: '7px'}}
            variant="contained"
            fullWidth={true}
          >
            Register
          </Button>
        </form>
      </Box>
    </div>
  );
}

export function RegisterPage() {
  return (
    <main className={style.register__root}>
      <div className={style.left__side}></div>
      <RegisterFormSide/>
    </main>
  );
}
