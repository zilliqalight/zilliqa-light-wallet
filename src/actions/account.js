import { RESET_STATE } from './constants';

export const SET_ACCOUNT_INFO = 'SET_ACCOUNT_INFO';
export const SET_ACTIVE_ACCOUNT_DETAILS = 'SET_ACTIVE_ACCOUNT_DETAILS';

export const setAccountInfo = (accounts, activeAccount) => ({
  type: SET_ACCOUNT_INFO,
  payload: {
    accounts,
    activeAccount,
  },
});

export const setActiveAccountDetails = activeAccountDetails => ({
  type: SET_ACTIVE_ACCOUNT_DETAILS,
  payload: {
    activeAccountDetails,
  },
});

export const resetAccount = () => ({
  type: RESET_STATE,
});
