import CryptoJS from 'crypto-js';
import { TESTNET } from '../networks';

const getOrCreateAppSalt = () => {
  return new Promise(resolve => {
    /* eslint-disable no-undef */
    chrome.storage.local.get('appSalt', result => {
      const appSalt = result.appSalt;
      if (appSalt) {
        resolve(appSalt);
      } else {
        const newAppSalt = CryptoJS.lib.WordArray.random(32).toString();
        chrome.storage.local.set({ appSalt: newAppSalt }, result => {
          resolve(newAppSalt);
        });
      }
    });
  });
};

const setPasswordHash = passwordHash => {
  return new Promise(resolve => {
    /* eslint-disable no-undef */
    chrome.storage.local.set({ passwordHash }, result => {
      resolve(passwordHash);
    });
  });
};

const getPasswordHash = () => {
  return new Promise(resolve => {
    /* eslint-disable no-undef */
    chrome.storage.local.get('passwordHash', result => {
      const passwordHash = result.passwordHash;
      if (passwordHash) {
        resolve(passwordHash.toString());
      } else {
        resolve(null);
      }
    });
  });
};

const setAccounts = accounts => {
  return new Promise(resolve => {
    /* eslint-disable no-undef */
    chrome.storage.local.set({ accounts }, result => {
      resolve(accounts);
    });
  });
};

const getAccounts = () => {
  return new Promise(resolve => {
    /* eslint-disable no-undef */
    chrome.storage.local.get('accounts', result => {
      const accounts = result.accounts;
      if (accounts) {
        resolve(accounts);
      } else {
        resolve([]);
      }
    });
  });
};

const setNetwork = network => {
  return new Promise(resolve => {
    /* eslint-disable no-undef */
    chrome.storage.local.set({ network: network }, function(result) {
      resolve(network);
    });
  });
};

const getNetworkOrDefault = () => {
  return new Promise(resolve => {
    /* eslint-disable no-undef */
    chrome.storage.local.get('network', function(result) {
      const network = result.network;
      if (network) {
        resolve(network);
      } else {
        resolve(TESTNET);
      }
    });
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
