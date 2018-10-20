import xhr from 'axios';

const COINMARKETCAP_URL = 'https://api.coinmarketcap.com/v2/ticker/2469/';

export default async () => {
  const { data } = await xhr.get(COINMARKETCAP_URL);
  return data.data.quotes.USD;
};
