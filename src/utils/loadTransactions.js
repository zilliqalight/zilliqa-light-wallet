import xhr from 'axios';
import { getViewBlockAddressHistoryAPIURL } from './networks';

export default async (address, network) => {
  const addressHistory = getViewBlockAddressHistoryAPIURL(address, network);
  const { data } = await xhr.get(addressHistory);
  if (data && data.txs) {
    return data.txs.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    return null;
  }
};
