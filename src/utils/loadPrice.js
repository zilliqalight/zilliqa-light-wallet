import xhr from 'axios';

const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/';
const KEY = '79766571-1511-4aa4-b91a-5c85fca8a4be';

export default async () => {
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  const request = xhr.create({
    baseURL: BASE_URL,
    timeout: 3000,
    headers: { 'X-CMC_PRO_API_KEY': KEY },
  });
  const { data } = await request.get('listings/latest');
  const zil = data.data.find(coin => coin.symbol === 'ZIL');
  if (zil) {
    return zil.quote.USD;
  } else {
    return null;
  }
};
