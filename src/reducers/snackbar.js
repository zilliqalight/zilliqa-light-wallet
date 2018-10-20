import { RESET_STATE } from '../actions/constants';
import { HIDE_SNACKBAR, SHOW_SNACKBAR } from '../actions/snackbar';

const initialState = {
  snackbarOpen: false,
  snackbarMessage: '',
};

export function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_SNACKBAR:
    case HIDE_SNACKBAR: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case RESET_STATE:
      return initialState;
    default:
      return state;
  }
}
