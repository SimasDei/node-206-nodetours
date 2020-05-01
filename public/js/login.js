/* eslint-disable */

const login = async (email, password) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(response);
  } catch (error) {
    console.log(error.response.data);
  }
};

document.querySelector('.form--login').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  login(email, password);
});
