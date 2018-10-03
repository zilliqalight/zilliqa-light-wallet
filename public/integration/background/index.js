let passwordHash = null; // passwordHash will be passed by popup
let activeAccount = null; // activeAccount will be passed by popup
let activePrivateKey = null; // activePrivateKey will be passed by popup

const getPrivateKey = () => {
  return activePrivateKey;
};

const getActiveAccount = () => {
  return activeAccount;
};

// get password hash and return to popup
window.getPasswordHash = () => {
  return passwordHash;
};

// set password hash from popup
window.setPasswordHash = (data) => {
  passwordHash = data;
  return passwordHash;
};

// get ActiveAccount hash and return to popup
window.getActiveAccount = () => {
  return activeAccount;
};

// set password hash from popup
window.setActiveAccount = (data) => {
  activeAccount = data;
  return activeAccount;
};

// get
window.getActivePrivateKey = () => {
  return activePrivateKey;
};

// set
window.setActivePrivateKey = (data) => {
  activePrivateKey = data;
  return activePrivateKey;
};
