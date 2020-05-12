/* eslint-disable */
import axios from 'axios';

export const login = async (email, password) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (data.status === 'success') {
      alert('Logged in successfully! ');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};
