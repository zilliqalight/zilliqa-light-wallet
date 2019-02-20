import { RESET_STATE } from '../actions/constants';
import {
  IMPORT_PRIVATE_KEY,
  SHOW_CREATE_ACCOUNT,
  SHOW_IMPORT_MNEMONIC,
  SHOW_IMPORT_PRIVATE_KEY,
  SHOW_RECEIVE_TOKEN,
  SHOW_SEND_TOKEN,
  SHOW_BACKUP_KEYSTORE,
  SHOW_WALLET_BACKUP,
  SHOW_WALLET_RESET,
  SHOW_IMPORT_KEYSTORE,
  RELOAD_ACCOUNT,
} from '../actions/wallet';

const initialState = {
  sendTokenOpen: false,
  receiveTokenOpen: false,
  createAccountOpen: false,
  importMnemonicOpen: false,
  importPrivateKeyOpen: false,
  importKeystoreOpen: false,
  backupKeystoreOpen: false,
  walletBackupOpen: false,
  walletResetOpen: false,
};

export function walletReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_IMPORT_PRIVATE_KEY:
    case SHOW_IMPORT_MNEMONIC:
    case SHOW_IMPORT_KEYSTORE:
    case SHOW_CREATE_ACCOUNT:
    case SHOW_SEND_TOKEN:
    case SHOW_RECEIVE_TOKEN:
    case SHOW_BACKUP_KEYSTORE:
    case SHOW_WALLET_BACKUP:
    case SHOW_WALLET_RESET:
    case IMPORT_PRIVATE_KEY:
    case RELOAD_ACCOUNT: {
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
