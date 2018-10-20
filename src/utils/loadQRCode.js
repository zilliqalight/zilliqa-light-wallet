import * as QRCode from 'qrcode';

const loadQRCode = async address => {
  const qrCode = await QRCode.toDataURL(address);
  return qrCode;
};

export default loadQRCode;
