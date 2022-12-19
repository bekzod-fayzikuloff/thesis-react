import { useState } from 'react';
import { getResponse } from '../../services/utils/sendRequest';
import { API_URL } from '../../config';
import style from './Sidebar.module.scss';
import defaultUserLogo from '../../assets/images/default_user.jpg';
import { useNavigate } from 'react-router-dom';

export function SearchInput() {
  return (
    <p
      style={{
        fontSize: '19pt',
        fontWeight: '500',
        borderBottom: '1px solid gray',
        margin: '5pt'
      }}
    >
      Search users
    </p>
  );
}

export function SearchItem({ user, onClose }) {
  const navigate = useNavigate();

  return (
    <div className={style.follower__item}>
      <div>
        <img
          onClick={() => {
            onClose();
            navigate(`/profile/${user.id}`);
          }}
          style={{
            margin: '4pt',
            width: '36px',
            height: '36px',
            borderRadius: '50%'
          }}
          src={
            user.avatar
              ? user.avatar.includes('media')
                ? user.avatar
                : API_URL?.concat(user.avatar)
              : defaultUserLogo
          }
          alt=""
        />
      </div>
      <p>
        <span
          onClick={() => {
            onClose();
            navigate(`/profile/${user.id}`);
          }}
        >
          {user.username}
        </span>
      </p>
    </div>
  );
}

export function SearchSection({ modalClose }) {
  const [users, setUsers] = useState([]);
  const handleChange = (e) => {
    console.log(e.target.value);
    if (e.target.value !== '') {
      getResponse(
        `${API_URL}/api/profiles/?username=${e.target.value}`,
        JSON.parse(localStorage.getItem('authToken')).access
      ).then((response) => setUsers(response.data.results));
    }
  };
  return (
    <>
      <SearchInput />
      <input
        style={{
          height: '21px',
          fontSize: '17px'
        }}
        className={style.search__input}
        type="text"
        onChange={handleChange}
      />
      {users.map((user) => (
        <SearchItem onClose={modalClose} key={user.id} user={user} />
      ))}
    </>
  );
}
