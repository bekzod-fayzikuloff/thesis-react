import style from './Login.module.scss';
import { Alert, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import LockIcon from '@mui/icons-material/Lock';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AccountCircle } from '@mui/icons-material';
import { validatePassword, validateUsername } from '../../services/utils/validators';
import { InfinitySpin } from 'react-loader-spinner';

function LoginFormSide() {
  const navigate = useNavigate();

  return (
    <div className={style.right__side}>
      <div className={style.buttons__sections}>
        <div>
          <Button
            style={{ backgroundColor: '#343A40', borderRadius: '11px' }}
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            style={{ backgroundColor: '#0055FF', borderRadius: '11px' }}
            variant="contained"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </div>

      <LoginForm />
      <p className={style.form__underline}>
        Dont have account
        <span
          style={{ color: '#1E74FD', fontWeight: 'bold' }}
          onClick={() => navigate('/register')}
        >
          {' '}
          Register
        </span>
      </p>
    </div>
  );
}

type LoginPayload = {
  username?: string;
  password?: string;
};

function LoginForm() {
  const navigate = useNavigate();
  const loginForm = useRef<null | HTMLFormElement>(null);
  const { loginUser } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorText, setErrorText] = useState('Something with server was wrong');

  const handleLogin = () => {
    const form = loginForm.current;
    if (!form) {
      alert('Not Form');
      return;
    }
    const payload: LoginPayload = {};
    try {
      payload.username = validateUsername(form.username.value);
      payload.password = validatePassword(form.password.value);
    } catch (err: unknown) {
      if (err instanceof Error) {
        switch (err.message) {
          case 'UsernameError':
            setErrorText(
              'The user field is require length must be greater then 4 and not contains space'
            );
            break;
          case 'EmailError':
            setErrorText('The email field should not be valid, check the correctness of filling');
            break;
          case 'PasswordError':
            setErrorText(
              'The password field is require length must be not less then 8 and not contains space and not be too common'
            );
            break;
          case 'PasswordDiffError':
            setErrorText('The password is different');
            break;
          default:
            setErrorText(err.message);
        }
        setError(true);
      }
      return;
    }
    const { username, password } = payload;
    setLoading(true);
    loginUser(
      username,
      password,
      () => {
        setLoading(false);
        navigate('/');
      },
      () => {
        setLoading(false);
        setError(true);
      }
    );
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
      <p className={style.form__headline}>Login into your account</p>
      {isLoading && <InfinitySpin width="200" color="#4fa94d" />}
      {isError && <Alert severity="error">{errorText}</Alert>}
      <Box
        className={style.form__box}
        sx={{
          width: '35%',
          '& > :not(style)': { m: 1 }
        }}
      >
        <form ref={loginForm}>
          <Input
            id="username"
            onChange={() => setError(false)}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
            placeholder="Enter your username"
            fullWidth={true}
          />
          <br />
          <Input
            onChange={() => setError(false)}
            id="password"
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
            placeholder="Enter your password"
            type={'password'}
            fullWidth={true}
          />
          <br />
          <FormControlLabel
            style={{ color: '#808383' }}
            control={<Checkbox style={{ fontSize: '12px' }} name="remember" />}
            label="Remember me"
          />
          <Button
            style={{ backgroundColor: '#343A40', borderRadius: '7px' }}
            variant="contained"
            fullWidth={true}
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
      </Box>
    </div>
  );
}

export function LoginPage() {
  return (
    <main className={style.register__root}>
      <div className={style.left__side}></div>
      <LoginFormSide />
    </main>
  );
}
