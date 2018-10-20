import { RESET_STATE } from './constants';

const SET_SCREEN = 'SET_SCREEN';

const SCREEN_UNLOCK_WALLET = 'SCREEN_UNLOCK_WALLET';
const SCREEN_WALLET = 'SCREEN_WALLET';
const SCREEN_CREATE_WALLET = 'SCREEN_CREATE_WALLET';
const SCREEN_IMPORT_OR_CREATE_ACCOUNT = 'SCREEN_IMPORT_OR_CREATE_ACCOUNT';

const SET_APP_SALT = 'SET_APP_SALT';
const SET_NETWORK = 'SET_NETWORK';
const SET_PASSWORD_HASH = 'SET_PASSWORD_HASH';

export {
  SET_SCREEN,
  SCREEN_UNLOCK_WALLET,
  SCREEN_WALLET,
  SCREEN_CREATE_WALLET,
  SCREEN_IMPORT_OR_CREATE_ACCOUNT,
  SET_APP_SALT,
  SET_NETWORK,
  SET_PASSWORD_HASH,
};

export const setScreen = screen => ({
  type: SET_SCREEN,
  payload: {
    screen,
  },
});

export const setAppSalt = appSalt => ({
  type: SET_APP_SALT,
  payload: {
    appSalt,
  },
});

export const setNetwork = network => ({
  type: SET_NETWORK,
  payload: {
    network,
  },
});

export const setPasswordHash = (
  passwordHashInBackground,
  passwordHashInStorage
) => ({
  type: SET_PASSWORD_HASH,
  payload: {
    passwordHashInBackground,
    passwordHashInStorage,
  },
});

export const resetApp = () => ({
  type: RESET_STATE,
});
