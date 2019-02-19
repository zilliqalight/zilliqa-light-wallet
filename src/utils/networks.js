import { Zilliqa } from '@zilliqa-js/zilliqa';
import { bytes } from '@zilliqa-js/util';

const MAINNET = 'MAINNET';
const TESTNET = 'TESTNET';
const DEFAULT_NETWORK = TESTNET;

const isMainnet = network => network === MAINNET;
const isTestnet = network => network === TESTNET;

const MAINNET_NODE_URL = 'https://api.zilliqa.com/';
const TESTNET_NODE_URL = 'https://dev-api.zilliqa.com';

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

const getZilliqaVersion = async zilliqa => {
  const { result } = await zilliqa.network.GetNetworkId();
  const MSG_VERSION = 1;
  return bytes.pack(result, MSG_VERSION);
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
