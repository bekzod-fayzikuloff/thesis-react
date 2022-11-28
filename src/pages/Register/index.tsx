import style from './Register.module.scss';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

function RegisterFormSide() {
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

      <RegisterForm />
      <p className={style.form__underline}>
        Already have account
        <span style={{ color: '#1E74FD', fontWeight: 'bold' }} onClick={() => navigate('/login')}>
          {' '}
          Login
        </span>
      </p>
    </div>
  );
}

function RegisterForm() {
  const registerForm = useRef<null | HTMLFormElement>(null);

  const handleRegister = () => {
    const form = registerForm.current;
    if (!form) {
      alert('Not Form');
      return;
    }
    const payload = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      passwordConfirm: form.password.value
    };
    console.log(payload);
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
      <Box
        className={style.form__box}
        sx={{
          width: '35%',
          '& > :not(style)': { m: 1 }
        }}
      >
        <form ref={registerForm}>
          <Input
            id="username"
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
            fullWidth={true}
          />
          <br />
          <Input
            id="email"
            startAdornment={
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            }
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
            type={'password'}
            fullWidth={true}
          />
          <br />
          <Input
            id="passwordConfirm"
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
            type={'password'}
            fullWidth={true}
          />
          <br />
          <FormControlLabel
            style={{ color: '#808383' }}
            control={<Checkbox style={{ fontSize: '12px' }} name="term" />}
            label="Accept Term and Conditions"
          />
          <Button
            onClick={handleRegister}
            style={{ backgroundColor: '#343A40', borderRadius: '7px' }}
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
      <RegisterFormSide />
    </main>
  );
}
