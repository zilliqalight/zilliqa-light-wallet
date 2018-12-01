import { Zilliqa } from '@zilliqa-js/zilliqa';

const MAINNET = 'MAINNET';
const TESTNET = 'TESTNET';
const DEFAULT_NETWORK = TESTNET;

const isMainnet = network => network === MAINNET;
const isTestnet = network => network === TESTNET;

const TESTNET_NODE_URL = 'https://api.zilliqa.com/'; // https://api-scilla.zilliqa.com/
const getNodeUrl = network => {
  if (isMainnet(network)) {
    return 'https://mainnet.is.not.support.yet';
  } else if (isTestnet(network)) {
    return TESTNET_NODE_URL;
  } else {
    return TESTNET_NODE_URL;
  }
};

const createZilliqa = network => {
  return new Zilliqa(getNodeUrl(network));
};

export {
  MAINNET,
  TESTNET,
  DEFAULT_NETWORK,
  getNodeUrl,
  isMainnet,
  isTestnet,
  createZilliqa,
};
