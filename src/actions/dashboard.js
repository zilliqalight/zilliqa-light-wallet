import { RESET_STATE } from './constants';

export const SHOW_ACCOUNTS = 'SHOW_ACCOUNTS';
export const HIDE_ACCOUNTS = 'HIDE_ACCOUNTS';

export const showAccounts = anchorEl => ({
  type: SHOW_ACCOUNTS,
  payload: {
    accountsOpen: true,
    anchorEl: anchorEl,
  },
});

export const hideAccounts = () => ({
  type: HIDE_ACCOUNTS,
  payload: {
    accountsOpen: false,
    anchorEl: null,
  },
});

export const resetDashboard = () => ({
  type: RESET_STATE,
});
