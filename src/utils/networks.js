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

const VIEWBLOCK_URL = 'https://api.viewblock.io/zilliqa/addresshistory/';
const VIEWBLOCK_TESTNET = 'network=testnet';

const EXPLORER_ADDRESS_URL = 'https://viewblock.io/zilliqa/address/';
const EXPLORER_TX_URL = 'https://viewblock.io/zilliqa/tx/';

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

const getViewBlockAddressHistoryAPIURL = (address, network) => {
  if (isMainnet(network)) {
    return `${VIEWBLOCK_URL}${address}`;
  } else {
    return `${VIEWBLOCK_URL}${address}?${VIEWBLOCK_TESTNET}`;
  }
};

const getViewBlockAddressExplorerURL = (address, network) => {
  if (isMainnet(network)) {
    return `${EXPLORER_ADDRESS_URL}${address}`;
  } else {
    return `${EXPLORER_ADDRESS_URL}${address}?${VIEWBLOCK_TESTNET}`;
  }
};

const getViewBlockTXHashExplorerURL = (txHash, network) => {
  if (isMainnet(network)) {
    return `${EXPLORER_TX_URL}${txHash}`;
  } else {
    return `${EXPLORER_TX_URL}${txHash}?${VIEWBLOCK_TESTNET}`;
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
  getViewBlockAddressHistoryAPIURL,
  getViewBlockAddressExplorerURL,
  getViewBlockTXHashExplorerURL,
};
