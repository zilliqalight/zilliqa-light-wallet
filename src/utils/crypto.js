import bip39 from 'bip39';
import hdkey from 'hdkey';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import passwordValidator from 'password-validator';

import { backgroundPage } from './backgroundPage';

export const ZeroBalanceUserDetails = {
  balance: '0',
  nonce: 0,
};

export const isAddress = address => {
  return address && address.length === 40;
};

export const getTxAbbreviation = tx => {
  if (tx) {
    return tx.substr(0, 8) + '...' + tx.substr(tx.length - 8, 8);
  } else {
    return 'pending...';
  }
};

export const getAddressAbbreviation = address => {
  if (address) {
    return address.substr(0, 8) + '...' + address.substr(address.length - 8, 8);
  } else {
    return '';
  }
};

export const isAppPasswordValid = password => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(20) // Maximum length 20
    .has()
    .not()
    .spaces(); // Should not have spaces

  return password && schema.validate(password);
};

export const isPrivateKeyValid = privateKey => {
  return privateKey && privateKey.length > 0;
};

export const isMnemonicValid = mnemonic => {
  if (mnemonic.trim().split(/\s+/g).length < 12) {
    return false;
  }
  return bip39.validateMnemonic(mnemonic);
};

export const mnemonicToPrivateKey = mnemonic => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const hdKey = hdkey.fromMasterSeed(seed);
  const childKey = hdKey.derive(`m/44'/8888'/0'/0/0`);
  const privateKey = childKey.privateKey.toString('hex');
  return privateKey;
};

export const getActivePrivateKey = async encryptedPrivateKey => {
  const passwordHashInBackground = await backgroundPage.getPasswordHash();
  const privateKey = AES.decrypt(
    encryptedPrivateKey,
    passwordHashInBackground
  ).toString(CryptoJS.enc.Utf8);

  return privateKey;
};
