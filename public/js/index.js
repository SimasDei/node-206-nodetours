/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { displayMap } from './mapbox';

document.querySelector('.form--login').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  login(email, password);
});

const locations = JSON.parse(document.getElementById('map').dataset.locations);
displayMap(locations);
