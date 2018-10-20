import CryptoJS from 'crypto-js';
import Lockr from 'lockr';

import { TESTNET } from '../networks';

const getOrCreateAppSalt = () => {
  return new Promise(resolve => {
    const appSalt = Lockr.get('appSalt');
    if (appSalt) {
      resolve(appSalt);
    } else {
      const newAppSalt = CryptoJS.lib.WordArray.random(32).toString();
      Lockr.set('appSalt', newAppSalt);
      resolve(newAppSalt);
    }
  });
};

const setPasswordHash = passwordHash => {
  return new Promise(resolve => {
    Lockr.set('passwordHash', passwordHash);
    resolve(passwordHash);
  });
};

const getPasswordHash = () => {
  return new Promise(resolve => {
    const passwordHash = Lockr.get('passwordHash');
    if (passwordHash) {
      resolve(passwordHash);
    } else {
      resolve(null);
    }
  });
};

const setAccounts = accounts => {
  return new Promise(resolve => {
    Lockr.set('accounts', accounts);
    resolve(accounts);
  });
};

const getAccounts = () => {
  return new Promise(resolve => {
    const accounts = Lockr.get('accounts');
    if (accounts) {
      resolve(accounts);
    } else {
      resolve([]);
    }
  });
};

const setNetwork = network => {
  return new Promise(resolve => {
    Lockr.set('network', network);
    resolve(network);
  });
};

const getNetworkOrDefault = () => {
  return new Promise(resolve => {
    const network = Lockr.get('network');
    if (network) {
      resolve(network);
    } else {
      resolve(TESTNET);
    }
  });
};

export const localStorage = {
  getOrCreateAppSalt,
  setPasswordHash,
  getPasswordHash,
  setAccounts,
  getAccounts,
  setNetwork,
  getNetworkOrDefault,
};
