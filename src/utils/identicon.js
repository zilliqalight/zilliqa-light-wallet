import Identicon from 'identicon.js';

export const getIdenticonImage = address => {
  const identicon = new Identicon(address, 64).toString();
  return `data:image/png;base64,${identicon}`;
};
