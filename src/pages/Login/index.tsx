import style from './Login.module.scss';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RegisterFormSide() {
  const navigate = useNavigate();
  return (
    <div className={style.right__side}>
      <div className={style.buttons__sections}>
        <div>
          <Button
            style={{ backgroundColor: '#343A40', borderRadius: '11px' }}
            variant="contained"
            onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button
            style={{ backgroundColor: '#0055FF', borderRadius: '11px' }}
            variant="contained"
            onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>
      </div>

      <LoginForm />
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

function LoginForm() {
  return (
    <div>
      <h1>Hess</h1>
    </div>
  );
}

export function LoginPage() {
  return (
    <main className={style.register__root}>
      <div className={style.left__side}></div>
      <RegisterFormSide />
    </main>
  );
}
