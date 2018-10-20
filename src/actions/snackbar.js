import { RESET_STATE } from './constants';

export const SHOW_SNACKBAR = 'SHOW_SNACKBAR';
export const HIDE_SNACKBAR = 'HIDE_SNACKBAR';

export const showSnackbar = message => ({
  type: SHOW_SNACKBAR,
  payload: {
    snackbarOpen: true,
    snackbarMessage: message,
  },
});

export const hideSnackbar = () => ({
  type: HIDE_SNACKBAR,
  payload: {
    snackbarOpen: false,
    snackbarMessage: '',
  },
});

export const resetSnackbar = () => ({
  type: RESET_STATE,
});
