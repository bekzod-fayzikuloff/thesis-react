import axios from 'axios';

const sendData = async (resourceUrl: string, data: object) => {
  return await fetch(resourceUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

const sendDataAuthRequire = async (
  method: string,
  resourceUrl: string,
  data: object,
  authTokenAccess: any
) => {
  return await axios({
    method: method,
    url: resourceUrl,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authTokenAccess}`
    },
    data: JSON.stringify(data)
  });
};

const getResponse = async (resourceUrl: string, authTokenAccess: string | null) => {
  return await axios.get(resourceUrl, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authTokenAccess}`
    }
  });
};

export { sendData, sendDataAuthRequire, getResponse };
