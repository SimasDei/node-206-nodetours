/* eslint-disable */

const login = async (email, password) => {
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

document.querySelector('.form--login').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  login(email, password);
});
