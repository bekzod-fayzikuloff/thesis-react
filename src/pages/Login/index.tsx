import style from './Login.module.scss';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import LockIcon from '@mui/icons-material/Lock';
import { useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AccountCircle } from '@mui/icons-material';

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

function LoginForm() {
  const loginForm = useRef<null | HTMLFormElement>(null);
  const { loginUser } = useContext(AuthContext);

  const handleLogin = () => {
    const form = loginForm.current;
    if (!form) {
      alert('Not Form');
      return;
    }
    const payload = {
      username: form.username.value,
      password: form.password.value
    };
    const { username, password } = payload;
    loginUser(username, password);
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
