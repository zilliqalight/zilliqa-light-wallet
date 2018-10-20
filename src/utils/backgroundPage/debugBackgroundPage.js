import Lockr from 'lockr';

const getPasswordHash = () => {
  return new Promise(resolve => {
    const passwordHash = Lockr.get('bg-passwordHash');
    if (passwordHash) {
      resolve(passwordHash);
    } else {
      resolve(null);
    }
  });
};

const setPasswordHash = passwordHash => {
  return new Promise(resolve => {
    Lockr.set('bg-passwordHash', passwordHash);
    resolve(passwordHash);
  });
};

const getActiveAccount = () => {
  return new Promise(resolve => {
    const activeAccount = Lockr.get('bg-activeAccount');
    if (activeAccount) {
      resolve(activeAccount);
    } else {
      resolve(null);
    }
  });
};

const setActiveAccount = activeAccount => {
  return new Promise(resolve => {
    Lockr.set('bg-activeAccount', activeAccount);
    resolve(activeAccount);
  });
};

export const backgroundPage = {
  getPasswordHash,
  setPasswordHash,
  getActiveAccount,
  setActiveAccount,
};
