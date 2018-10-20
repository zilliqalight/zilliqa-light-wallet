import { appReducer } from './app';
import { accountReducer } from './account';
import { snackbarReducer } from './snackbar';
import { appBarReducer } from './appBar';
import { walletReducer } from './wallet';
import { dashboardReducer } from './dashboard';

export default {
  app: appReducer,
  account: accountReducer,
  snackbar: snackbarReducer,
  appBar: appBarReducer,
  wallet: walletReducer,
  dashboard: dashboardReducer,
};
