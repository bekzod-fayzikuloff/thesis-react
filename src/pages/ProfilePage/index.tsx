import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

export function ProfilePage() {
  const { logoutUser } = useContext(AuthContext);
  return (
    <div>
      <h1 onClick={logoutUser}>right</h1>
    </div>
  );
}
