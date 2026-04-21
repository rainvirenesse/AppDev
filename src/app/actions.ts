// AUTH

import { LoginCredentials } from "../types/api.types";

// AUTH/USER_LOGIN
export const USER_LOGIN: string = 'USER_LOGIN';
export const USER_LOGIN_REQUEST: string = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETED: string = 'USER_LOGIN_COMPLETED';
export const USER_LOGIN_ERROR: string = 'USER_LOGIN_ERROR';
export const USER_LOGIN_RESET: string = 'USER_LOGIN_RESET';
export const USER_REGISTER: string = 'USER_REGISTER';                      //new added
export const USER_REGISTER_COMPLETED: string = 'USER_REGISTER_COMPLETED'; //new added

export const userLogin = (payload: LoginCredentials) => ({
  type: USER_LOGIN,
  payload,
});


export const resetLogin = () => ({
  type: USER_LOGIN_RESET
});