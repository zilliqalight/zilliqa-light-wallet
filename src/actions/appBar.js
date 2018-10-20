import { RESET_STATE } from './constants';

const SHOW_NETWORK = 'SHOW_NETWORK';

export { SHOW_NETWORK };

export const showNetwork = () => ({
  type: SHOW_NETWORK,
  payload: {
    networkOpen: true,
  },
});

export const hideNetwork = () => ({
  type: SHOW_NETWORK,
  payload: {
    networkOpen: false,
  },
});

export const resetAppBar = () => ({
  type: RESET_STATE,
});
