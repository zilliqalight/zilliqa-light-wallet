import xhr from 'axios';

const VIEWBLOCK_URL = 'https://api.viewblock.io/zilliqa/addresshistory/';

export default async address => {
  const { data } = await xhr.get(`${VIEWBLOCK_URL}${address}?network=testnetv3`);
  if (data && data.txs) {
    return data.txs.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    return null;
  }
};
