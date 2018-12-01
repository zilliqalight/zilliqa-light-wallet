import { RESET_STATE } from './constants';

export const SHOW_IMPORT_PRIVATE_KEY = 'SHOW_IMPORT_PRIVATE_KEY';
export const SHOW_IMPORT_MNEMONIC = 'SHOW_IMPORT_MNEMONIC';
export const SHOW_IMPORT_KEYSTORE = 'SHOW_IMPORT_KEYSTORE';
export const SHOW_CREATE_ACCOUNT = 'SHOW_CREATE_ACCOUNT';
export const SHOW_SEND_TOKEN = 'SHOW_SEND_TOKEN';
export const SHOW_RECEIVE_TOKEN = 'SHOW_RECEIVE_TOKEN';
export const SHOW_BACKUP_KEYSTORE = 'SHOW_BACKUP_KEYSTORE';
export const SHOW_WALLET_BACKUP = 'SHOW_WALLET_BACKUP';
export const SHOW_WALLET_RESET = 'SHOW_WALLET_RESET';

export const IMPORT_PRIVATE_KEY = 'IMPORT_PRIVATE_KEY';
export const IMPORT_MNEMONIC = 'IMPORT_MNEMONIC';
export const IMPORT_KEYSTORE = 'IMPORT_KEYSTORE';

export const showImportPrivateKey = () => ({
  type: SHOW_IMPORT_PRIVATE_KEY,
  payload: {
    importPrivateKeyOpen: true,
  },
});

export const hideImportPrivateKey = () => ({
  type: SHOW_IMPORT_PRIVATE_KEY,
  payload: {
    importPrivateKeyOpen: false,
  },
});

export const showImportMnemonic = () => ({
  type: SHOW_IMPORT_MNEMONIC,
  payload: {
    importMnemonicOpen: true,
  },
});

export const hideImportMnemonic = () => ({
  type: SHOW_IMPORT_MNEMONIC,
  payload: {
    importMnemonicOpen: false,
  },
});

export const showImportKeystore = () => ({
  type: SHOW_IMPORT_KEYSTORE,
  payload: {
    importKeystoreOpen: true,
  },
});

export const hideImportKeystore = () => ({
  type: SHOW_IMPORT_KEYSTORE,
  payload: {
    importKeystoreOpen: false,
  },
});

export const showCreateAccount = () => ({
  type: SHOW_CREATE_ACCOUNT,
  payload: {
    createAccountOpen: true,
  },
});

export const hideCreateAccount = () => ({
  type: SHOW_CREATE_ACCOUNT,
  payload: {
    createAccountOpen: false,
  },
});

export const showSendToken = () => ({
  type: SHOW_SEND_TOKEN,
  payload: {
    sendTokenOpen: true,
  },
});

export const hideSendToken = () => ({
  type: SHOW_SEND_TOKEN,
  payload: {
    sendTokenOpen: false,
  },
});

export const showReceiveToken = () => ({
  type: SHOW_RECEIVE_TOKEN,
  payload: {
    receiveTokenOpen: true,
  },
});

export const hideReceiveToken = () => ({
  type: SHOW_RECEIVE_TOKEN,
  payload: {
    receiveTokenOpen: false,
  },
});

export const showBackupKeystore = () => ({
  type: SHOW_BACKUP_KEYSTORE,
  payload: {
    backupKeystoreOpen: true,
  },
});

export const hideBackupKeystore = () => ({
  type: SHOW_BACKUP_KEYSTORE,
  payload: {
    backupKeystoreOpen: false,
  },
});

export const importPrivateKey = privateKey => ({
  type: IMPORT_PRIVATE_KEY,
  payload: {
    privateKey,
  },
});

export const importMnemonic = mnemonic => ({
  type: IMPORT_MNEMONIC,
  payload: {
    mnemonic,
  },
});

export const importKeystore = keystore => ({
  type: IMPORT_KEYSTORE,
  payload: {
    keystore,
  },
});

export const showWalletBackup = mnemonic => ({
  type: SHOW_WALLET_BACKUP,
  payload: {
    walletBackupOpen: true,
    mnemonic: mnemonic,
  },
});

export const hideWalletBackup = () => ({
  type: SHOW_WALLET_BACKUP,
  payload: {
    walletBackupOpen: false,
  },
});

export const showWalletReset = () => ({
  type: SHOW_WALLET_RESET,
  payload: {
    walletResetOpen: true,
  },
});

export const hideWalletReset = () => ({
  type: SHOW_WALLET_RESET,
  payload: {
    walletResetOpen: false,
  },
});

export const resetWallet = () => ({
  type: RESET_STATE,
});
