import { LoginCredentials, LoginResponse } from '../../types/api.types';

const BASE_URL = 'http://192.168.1.10:8000/api';
const options = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

// export async function userLogin({ student_id, password }) {
// export async function authLogin({ email, password }) {
export async function authLogin({ email, password }: LoginCredentials) { 
  const response = await fetch(BASE_URL + '/login', {
    method: 'POST',
    ...options,
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data: LoginResponse = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message || 'Login failed');
  }
}

// export async function userRegister({ student_id, name, address, password }) {
//   const response = await fetch(BASE_URL + '/register', {
//     method: 'POST',
//     ...options,
//     body: JSON.stringify({
//       student_id,
//       name,
//       address,
//       password,
//     }),
//   });
//   const data = await response.json();

//   if (response.ok) {
//     return data;
//   } else {
//     throw new Error(data.message || 'Registration failed');
//   }
// }

// export async function userProfile({ student_id }) {
//   const response = await fetch(BASE_URL + '/profile', {
//     method: 'GET',
//     ...options,
//   });
//   const data = await response.json();

//   if (response.ok) {
//     return data;
//   } else {
//     throw new Error(data.message || 'Profile fetch failed');
//   }
// }