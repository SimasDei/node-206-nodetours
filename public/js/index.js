/* eslint-disable */
import { login } from './login';

document.querySelector('.form--login').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  login(email, password);
});
