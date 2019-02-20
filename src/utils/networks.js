import { Zilliqa } from '@zilliqa-js/zilliqa';
import { bytes } from '@zilliqa-js/util';

const MAINNET = 'MAINNET';
const TESTNET = 'TESTNET';
const DEFAULT_NETWORK = TESTNET;

const isMainnet = network => network === MAINNET;
const isTestnet = network => network === TESTNET;

const MAINNET_NODE_URL = 'https://api.zilliqa.com/';
const TESTNET_NODE_URL = 'https://dev-api.zilliqa.com';
const MAINNET_CHAIN_ID = 1;
const TESTNET_CHAIN_ID = 333;

const getNodeUrl = network => {
  if (isMainnet(network)) {
    return MAINNET_NODE_URL;
  } else if (isTestnet(network)) {
    return TESTNET_NODE_URL;
  } else {
    return TESTNET_NODE_URL;
  }
};

const createZilliqa = network => {
  return new Zilliqa(getNodeUrl(network));
};

const getZilliqaVersion = async network => {
  const chainID = isMainnet(network) ? MAINNET_CHAIN_ID : TESTNET_CHAIN_ID;
  const MSG_VERSION = 1;
  return bytes.pack(chainID, MSG_VERSION);
};

const getNetworkName = network => {
  if (isMainnet(network)) {
    return 'MAINNET';
  } else if (isTestnet(network)) {
    return 'TESTNET';
  } else {
    return 'UNKNOWNNET';
  }
};

export {
  MAINNET,
  TESTNET,
  DEFAULT_NETWORK,
  isMainnet,
  isTestnet,
  createZilliqa,
  getZilliqaVersion,
  getNetworkName,
};
