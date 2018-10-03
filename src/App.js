import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import Send from '@material-ui/icons/Send';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Launch from '@material-ui/icons/Launch';
import VpnKey from '@material-ui/icons/VpnKey';
import PermIdentity from '@material-ui/icons/PermIdentity';
import Wifi from '@material-ui/icons/Wifi';
import Dashboard from '@material-ui/icons/Dashboard';
import LockOpen from '@material-ui/icons/LockOpen';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';

import {CopyToClipboard} from "react-copy-to-clipboard";

import * as QRCode from "qrcode";
import xhr from "axios";
import BN from 'bn.js';

import bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import AES from 'crypto-js/aes';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';
import qs from 'qs';
import Identicon from 'identicon.js';

import logoZIL from './logo_zil.svg';
import logo from './logo.png';
import './App.css';
import {Zilliqa} from 'zilliqa-js';
const passwordValidator = require('password-validator');

const COINMARKETCAP_URL = 'https://api.coinmarketcap.com/v2/ticker/2469/';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#232328',
      main: '#232328',
      dark: '#169496',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#42BEC0',
      main: '#42BEC0',
      dark: '#42BEC0',
      contrastText: '#ffffff',
    },
    warning: {
      light: '#c04a42',
      main: '#c04a42',
      dark: '#42BEC0',
      contrastText: '#169496',
    },
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class App extends Component {
  state = {
    appsalt: null,
    passwordHash: null,
    passwordSHA256: null,
    account: null,
    accounts: null,
    identicon: null,
    activeAccount: null,
    receiveOpen: false,
    sendOpen: false,
    keyOpen: false,
    importPrivateKeyOpen: false,
    importMnemonicOpen: false,
    loading: false,
    loadingMessage: '',
    snackbarOpen: false,
    snackbarMessage: '',
    selectedTab: 0,
    backupPrivateKeyOpen: false,
    showPrivateKey: false,
    importMnemonic: '',
    accountsOpen: false,
    anchorEl: null,
    resetWalletOpen: false,
  };

  clear = async () => {
    this.setState({
      passwordHash: null,
      passwordSHA256: null,
      privateKey: null,
      address: null,
      account: null,
      accounts: null,
      identicon: null,
      activeAccount: null,
      accountDetailsOpen: false,
      receiveOpen: false,
      sendOpen: false,
      keyOpen: false,
      importPrivateKeyOpen: false,
      importMnemonicOpen: false,
      freezeOpen: false,
      snackbarOpen: false,
      isLoading: false,
      backupPrivateKeyOpen: false,
      showPrivateKey: false,
      transactions: undefined,
      importPrivateKey: '',
      importMnemonic: '',
      accountsOpen: false,
      anchorEl: null,
      resetWalletOpen: false,
    });

    await this.setPasswordHashBackgroundPage(null);
    await this.setActiveAccountBackgroundPage(null);
    await this.setActivePrivateKeyBackgroundPage(null);
  };

  componentDidMount() {
    this.initData();
    this.loadPrice();
  }

  initData = async () => {

    // initialize appsalt, generated per install
    // get from storage or set in storage if does not exist

    let appSalt = await this.getAppSaltLocalStorage();
    if (!appSalt) {
      appSalt = await this.setAppSaltLocalStorage();
    }
    this.setState({appSalt});


    if (!this.state.network) {
      const network = await this.getNetworkLocalStorage();
      if (network) {
        if (network === 'MAINNET') {
          this.setState({network: 'MAINNET'});
        } else {
          this.setState({network: 'TESTNET'});
        }
      } else {
        this.setState({network: 'TESTNET'});
        await this.setNetworkLocalStorage('TESTNET');
      }
    }

    // Retrieve passwordHash
    // passwordHash is generated from user password and stored in background page
    // it is only required every time user open chrome
    // passwordHash is used for encrypt all the private keys
    var passwordHash = await this.getPasswordHashBackgroundPage();
    this.setState({passwordHash});

    var passwordSHA256 = await this.getPasswordSHA256LocalStorage();
    this.setState({passwordSHA256});

    if (passwordSHA256) {
      let walletLabel = 'Unlock Wallet';
      this.setState({walletLabel});
      this.setState({walletInitialised: true});
    } else {
      let walletLabel = 'Create Wallet';
      this.setState({walletLabel});
      this.setState({walletInitialised: false});
    }

    var accounts = await this.getAccountsLocalStorage();
    this.setState({accounts});

    if (!this.state.accounts) {
      this.setState({importOpen: true});
    } else {
      this.setState({importOpen: false});
    }

    var activeAccount = await this.getActiveAccountBackgroundPage();

    this.setState({activeAccount});

    await this.loadActiveAccount();

  };


  loadActiveAccount = async () => {

    try {

      let accounts = this.state.accounts;
      let passwordHash = this.state.passwordHash;
      if (accounts && passwordHash) {

        let activeAccount = this.state.activeAccount;

        if (!activeAccount) {
          activeAccount = this.state.accounts[0];
          await this.setActiveAccountBackgroundPage(activeAccount);
        }

        if (activeAccount) {
          let privateKey = (AES.decrypt(activeAccount.account, passwordHash)).toString(CryptoJS.enc.Utf8);
          await this.setActivePrivateKeyBackgroundPage(privateKey);

          await this.initializeAccount(privateKey);

          this.setState({accounts: this.state.accounts});

          await this.loadAccount();
          await this.loadTransactions();
        }
      }

    }
    catch (e) {
      console.log(e);
      this.setState({
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Fail to process, make sure you select the correct network`,
      });
    }
  };


  initializeAccount = async (privateKey) => {

    const nodeUrl = this.getNodeUrl();
    const zilliqa = new Zilliqa({
      nodeUrl: nodeUrl
    });

    let address = zilliqa.util.getAddressFromPrivateKey(privateKey).toUpperCase();
    let publicKey = zilliqa.util.getPubKeyFromPrivateKey(privateKey).toUpperCase();
    let mnemonic = bip39.generateMnemonic();
    let identicon = new Identicon(address, 64).toString();

    this.setState({
      address,
      privateKey,
      publicKey,
      mnemonic,
      identicon,
    });

  };

  // ******************
  // Local Storage
  // ******************

  setAppSaltLocalStorage = () => {
    return new Promise(resolve => {
      var wordArray = CryptoJS.lib.WordArray.random(32);
      /* eslint-disable no-undef */
      chrome.storage.local.set(
        {'appsalt': wordArray.toString()}, function (result) {
          resolve(wordArray.toString());
        });
    });
  };

  getAppSaltLocalStorage = () => {
    return new Promise(resolve => {
      /* eslint-disable no-undef */
      chrome.storage.local.get('appsalt', function (result) {
        let appsalt = result.appsalt;
        if (appsalt) {
          resolve(appsalt.toString());
        } else {
          resolve(null);
        }
      });
    });
  };


  setPasswordSHA256LocalStorage = (pwdhash) => {
    return new Promise(resolve => {
      /* eslint-disable no-undef */
      chrome.storage.local.set(
        {'pwdhash': pwdhash}, function (result) {
          resolve(pwdhash);
        });
    });
  };

  getPasswordSHA256LocalStorage = () => {
    return new Promise(resolve => {
      /* eslint-disable no-undef */
      chrome.storage.local.get('pwdhash', function (result) {
        let pwdhash = result.pwdhash;
        if (pwdhash) {
          resolve(pwdhash.toString());
        } else {
          resolve(null);
        }
      });
    });
  };

  getAccountsLocalStorage = () => {
    return new Promise(resolve => {
      /* eslint-disable no-undef */
      chrome.storage.local.get('accounts', function (result) {
        let accounts = result.accounts;
        if (accounts) {
          resolve(accounts);
        } else {
          resolve(null);
        }
      });
    });
  };

  setAccountsLocalStorage = (accounts) => {
    return new Promise(resolve => {
      /* eslint-disable no-undef */
      chrome.storage.local.set(
        {'accounts': accounts}, function (result) {
          resolve(accounts);
        });
    });
  };

  getNetworkLocalStorage = () => {
    return new Promise(resolve => {
      /* eslint-disable no-undef */
      chrome.storage.local.get('network', function (result) {
        let network = result.network;
        if (network) {
          resolve(network);
        } else {
          resolve(null);
        }
      });
    });
  };

  setNetworkLocalStorage = (network) => {
    return new Promise(resolve => {
      /* eslint-disable no-undef */
      chrome.storage.local.set(
        {'network': network}, function (result) {
          resolve(network);
        });
    });
  };

  getPasswordHashBackgroundPage = () => {
    return new Promise(resolve => {
      const backgroundPage = window.chrome.extension.getBackgroundPage();
      let hash = backgroundPage ? backgroundPage.getPasswordHash() : null;
      resolve(hash);
    });
  };

  setPasswordHashBackgroundPage = (data) => {
    return new Promise(resolve => {
      const backgroundPage = window.chrome.extension.getBackgroundPage();
      let hash = backgroundPage ? backgroundPage.setPasswordHash(data) : null;
      resolve(hash);
    });
  };

  getActiveAccountBackgroundPage = () => {
    return new Promise(resolve => {
      const backgroundPage = window.chrome.extension.getBackgroundPage();
      let activeAccount = backgroundPage ? backgroundPage.getActiveAccount() : null;
      resolve(activeAccount);
    });
  };

  setActiveAccountBackgroundPage = (data) => {
    return new Promise(resolve => {
      const backgroundPage = window.chrome.extension.getBackgroundPage();
      let activeAccount = backgroundPage ? backgroundPage.setActiveAccount(data) : null;
      resolve(activeAccount);
    });
  };

  setActivePrivateKeyBackgroundPage = (data) => {
    return new Promise(resolve => {
      const backgroundPage = window.chrome.extension.getBackgroundPage();
      let activePrivateKey = backgroundPage ? backgroundPage.setActivePrivateKey(data) : null;
      resolve(activePrivateKey);
    });
  };

  getAppSalt() {
    return this.state.appsalt;
  }

  createAppHashPassword = async () => {
    let {createAppHashPassword} = this.state;
    let appSalt = await this.getAppSaltLocalStorage();

    var passwordSHA256 = await this.getPasswordSHA256LocalStorage();
    var pwdSHA256 = SHA256(createAppHashPassword).toString();

    var passwordValid = true;
    if (passwordSHA256) { // if there is a passwordSHA256 in local storage, compare to what is entered
      if (pwdSHA256 !== passwordSHA256) {
        passwordValid = false;
      }
    } else {
      await this.setPasswordSHA256LocalStorage(pwdSHA256);
    }

    if (!passwordValid) {
      this.setState({createAppHashPassword: ''});
      console.log('invalid password');
      this.setState({
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Invalid password`,
      });
      return false;
    }

    //generate passwordHash and set to background page
    var pwdHashObj = SHA512(createAppHashPassword, appSalt);
    var pwdHash = pwdHashObj.toString();

    let passwordHash = await this.setPasswordHashBackgroundPage(pwdHash);

    this.setState({passwordHash});

    var accounts = await this.getAccountsLocalStorage();
    this.setState({accounts});

    var activeAccount = await this.getActiveAccountBackgroundPage();
    this.setState({activeAccount});

    await this.loadActiveAccount();

    this.setState({createAppHashPassword: ''});
  };

  resetAppHashPassword = async () => {
    await this.setAppSaltLocalStorage(null);
    await this.setPasswordSHA256LocalStorage(null);
    await this.setAccountsLocalStorage(null);

    await this.setPasswordHashBackgroundPage(null);
    await this.setActiveAccountBackgroundPage(null);
    await this.setActivePrivateKeyBackgroundPage(null);


    this.setState({resetWalletOpen: false});
    this.setState({passwordHash: null});
    this.setState({accounts: null});
    this.setState({activeAccount: null});

    this.setState({privateKey: null});
    this.setState({publicKey: null});
    this.setState({address: null});
    this.setState({createAppHashPassword: ''});

    this.setState({importOpen: true});

    let walletLabel = 'Create Wallet';
    this.setState({walletLabel});
    this.setState({walletInitialised: false});
  };

  getNodeUrl = () => {
    if (this.state.network === 'MAINNET') {
      return '';
    } else if (this.state.network === 'TESTNET') {
      return 'https://api-scilla.zilliqa.com';
    } else {
      return 'https://api-scilla.zilliqa.com';
    }
  };

  getExplorerApiAddress = () => {
    if (this.state.network === 'MAINNET') {
      return '';
    } else if (this.state.network === 'TESTNET') {
      return 'https://explorer.zilliqa.com/address/';
    } else {
      return '';
    }
  };

  getExplorerAddress = () => {
    if (this.state.network === 'MAINNET') {
      return '';
    } else if (this.state.network === 'TESTNET') {
      return 'https://explorer.zilliqa.com/address/';
    } else {
      return 'https://explorer.zilliqa.com/address/';
    }
  };

  getExplorerTx = () => {
    if (this.state.network === 'MAINNET') {
      return '';
    } else if (this.state.network === 'TESTNET') {
      return 'https://explorer.zilliqa.com/transactions/';
    } else {
      return 'https://explorer.zilliqa.com/transactions/';
    }
  };

  //**************************
  //*****Local Functions *****
  //**************************


  createAccount = async () => {
    try {

      const nodeUrl = this.getNodeUrl();
      const zilliqa = new Zilliqa({
        nodeUrl: nodeUrl
      });
      let privateKey = zilliqa.util.generatePrivateKey();
      let address = zilliqa.util.getAddressFromPrivateKey(privateKey);
      this.setState({address});

      await this.getAppSaltLocalStorage();
      let passwordHash = await this.getPasswordHashBackgroundPage();
      let accounts = await this.getAccountsLocalStorage();
      if (!accounts) {
        accounts = [];
      }

      let encryptedPrivateKey = AES.encrypt(privateKey, passwordHash).toString();

      let activeAccount = {
        'address': this.state.address,
        'account': encryptedPrivateKey
      };

      accounts.push(activeAccount);
      await this.setAccountsLocalStorage(accounts); // set to storage

      await this.setActiveAccountBackgroundPage(activeAccount); // set activeAccount to background
      await this.setActivePrivateKeyBackgroundPage(privateKey);

      this.setState({
        activeAccount,
        accounts,
        backupPrivateKeyOpen: true,
        importOpen: false,
      });

      await this.loadActiveAccount(); // load active account

    } catch (e) {
      console.log(e);
      this.setState({
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Fail to process, make sure you select the correct network`,
      });
    }
  };

  importPrivateKey = async () => {
    let {importPrivateKey} = this.state;

    try {

      const nodeUrl = this.getNodeUrl();
      const zilliqa = new Zilliqa({
        nodeUrl: nodeUrl
      });
      // verify private key here

      if (zilliqa.util.verifyPrivateKey(importPrivateKey)) {
        let privateKey = importPrivateKey;

        const nodeUrl = this.getNodeUrl();
        const zilliqa = new Zilliqa({
          nodeUrl: nodeUrl
        });

        let address = zilliqa.util.getAddressFromPrivateKey(privateKey);
        this.setState({address});

        await this.getAppSaltLocalStorage();
        let passwordHash = await this.getPasswordHashBackgroundPage();
        let accounts = await this.getAccountsLocalStorage();
        if (!accounts) {
          accounts = [];
        }

        let encryptedPrivateKey = AES.encrypt(privateKey, passwordHash).toString();


        let accountExist = false;
        for (var i = 0; i < accounts.length; i++) {
          if (accounts[i].address.toLowerCase() === address.toLowerCase()) {
            accountExist = true;
          }
        }
        if (!accountExist) {

          let activeAccount = {
            'address': this.state.address,
            'account': encryptedPrivateKey
          };

          accounts.push(activeAccount);
          await this.setAccountsLocalStorage(accounts); // set to storage

          await this.setActiveAccountBackgroundPage(activeAccount); // set activeAccount to background
          await this.setActivePrivateKeyBackgroundPage(privateKey);
          this.setState({
            activeAccount,
            accounts,
            importPrivateKey: '',
            importMnemonic: '',
            importPrivateKeyOpen: false,
            importMnemonicOpen: false,
            importOpen: false,
          });

          await this.loadActiveAccount(); // load active account

        }else{

          this.setState({
            importPrivateKey: '',
            importMnemonic: '',
            importPrivateKeyOpen: false,
            importMnemonicOpen: false,
            importOpen: false,
            isLoading: false,
            snackbarOpen: true,
            snackbarMessage: `Account already imported`,
          });

        }

      } else {
        this.setState({
          isLoading: false,
          snackbarOpen: true,
          snackbarMessage: `Invalid private key`,
        });
      }

    } catch (e) {
      console.log(e);
      this.setState({
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Fail to process, make sure you select the correct network`,
      });
    }
  };

  importMnemonic = async () => {
    let {importMnemonic} = this.state;

    try {

      if (bip39.validateMnemonic(importMnemonic)) {
        let importPrivateKey = bip39.mnemonicToSeedHex(importMnemonic);
        const nodeUrl = this.getNodeUrl();
        const zilliqa = new Zilliqa({
          nodeUrl: nodeUrl
        });
        // verify private key here


        if (zilliqa.util.verifyPrivateKey(importPrivateKey)) {
          let privateKey = importPrivateKey;

          const nodeUrl = this.getNodeUrl();
          const zilliqa = new Zilliqa({
            nodeUrl: nodeUrl
          });

          let address = zilliqa.util.getAddressFromPrivateKey(privateKey);
          this.setState({address});

          await this.getAppSaltLocalStorage();
          let passwordHash = await this.getPasswordHashBackgroundPage();
          let accounts = await this.getAccountsLocalStorage();
          if (!accounts) {
            accounts = [];
          }

          let encryptedPrivateKey = AES.encrypt(privateKey, passwordHash).toString();

          let accountExist = false;
          for (var i = 0; i < accounts.length; i++) {
            if (accounts[i].address.toLowerCase() === address.toLowerCase()) {
              accountExist = true;
            }
          }
          if (!accountExist) {

             let activeAccount = {
                'address': this.state.address,
                'account': encryptedPrivateKey
              };

              accounts.push(activeAccount);
              await this.setAccountsLocalStorage(accounts); // set to storage

              await this.setActiveAccountBackgroundPage(activeAccount); // set activeAccount to background
              await this.setActivePrivateKeyBackgroundPage(privateKey);
              this.setState({
                activeAccount,
                accounts,
                importPrivateKey: '',
                importMnemonic: '',
                importPrivateKeyOpen: false,
                importMnemonicOpen: false,
                importOpen: false,
              });

              await this.loadActiveAccount(); // load active account


          }else{

              this.setState({
                importPrivateKey: '',
                importMnemonic: '',
                importPrivateKeyOpen: false,
                importMnemonicOpen: false,
                importOpen: false,
                isLoading: false,
                snackbarOpen: true,
                snackbarMessage: `Account already imported`,
              });
          }

         
        } else {
          this.setState({
            isLoading: false,
            snackbarOpen: true,
            snackbarMessage: `Invalid private key`,
          });
        }

      } else {
        this.setState({
          isLoading: false,
          snackbarOpen: true,
          snackbarMessage: `Invalid mnemonic`,
        });
      }


    } catch (e) {
      console.log(e);
      this.setState({
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Fail to process, make sure you select the correct network`,
      });
    }
  };

  reloadAccountDetails = async () => {
    this.setState({
      isLoading: false,
      snackbarOpen: true,
      snackbarMessage: 'Reloading',
    }, async () => {
      await this.loadActiveAccount();
    });
  };

  //**************************
  //*****Network functions ***
  //**************************

  async loadAccount() {
    if (this.state.address) {
      var that = this;
      const nodeUrl = this.getNodeUrl();
      const zilliqa = new Zilliqa({
        nodeUrl: nodeUrl
      });
      let node = zilliqa.getNode();
      node.getBalance(
        {address: this.state.address},
        function callback(err, data) {
          if (err || data.error) {
            console.log(err)
          } else {
            console.log(data.result)
            var account = data.result;
            var nonce = account ? account.nonce : 0;
            that.setState({
              account,
              nonce
            });
          }
        }
      );
    }
  }

  async loadTransactions() {
    if (this.state.address) {
      // const { data } = await xhr.get(`${this.getExplorerApiAddress()}${this.state.address}`);
      // if(data && data.txs) {
      //   this.setState({ transactions: data.txs });
      // }
    }
  }

  sendToken = async () => {
    const {sendTo, sendAmount, sendGasPrice, sendGasLimit, privateKey} = this.state;
    this.setState({isLoading: true});

    const nodeUrl = this.getNodeUrl();
    const zilliqa = new Zilliqa({
      nodeUrl: nodeUrl
    });

    var that = this;
    var nonce = this.state.nonce + 1;
    let node = zilliqa.getNode();

    // transaction details
    let txnDetails = {
      version: 0,
      nonce: nonce,
      to: sendTo,
      amount: new BN(sendAmount),
      gasPrice: parseFloat(sendGasPrice),
      gasLimit: parseFloat(sendGasLimit)
    };
    console.log('txnDetails', txnDetails);

    // sign the transaction using util methods
    let txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
    console.log('txn', txn);
    node.createTransaction(txn, function callback(err, data) {
      if (err || data.error) {
        console.log(err)
        that.setState({
          isLoading: false,
          snackbarOpen: true,
          snackbarMessage: `Sent failed, ${err}, please retry later.`,
        });
      } else {
        var tx = data.result;
        console.log('tx', tx)
        that.setState({
          isLoading: false,
          snackbarOpen: true,
          snackbarMessage: 'Succesfully sent tokens!',
          sendTo: '',
          sendAmount: ''
        }, () => {
          that.loadAccount();
          // this.loadTransactions();
          that.handleSendClose();
        });
      }
    });
  };

  async loadPrice() {
    const {data} = await xhr.get(COINMARKETCAP_URL);
    this.setState({price: data.data.quotes.USD});
  }

  //**************************
  //*****Validation Functions*****
  //**************************

  isPrivateKeyValid = () => {

    let {importPrivateKey} = this.state;
    if (!importPrivateKey || importPrivateKey.length === 0) {
      return false;
    }
    return true;
  };

  isMnemonicValid = () => {

    let {importMnemonic} = this.state;
    if (!importMnemonic || importMnemonic.length === 0) {
      return false;
    }

    return true;
  };


  //**************************
  //*****Handle Functions*****
  //**************************
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  setSendAmount = (amount) => {
    const sendAmount = amount.replace(/^0+(?!\.|$)/, '').replace(/[^0-9 .]+/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1");
    this.setState({
      sendAmount
    });

  };
  setFeeRate = (amount) => {
    const sendFeeRate = amount.replace(/^0+(?!\.|$)/, '').replace(/[^0-9 .]+/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1");
    this.setState({
      sendFeeRate
    });
  };

  isSendValid = () => {
    const {sendTo, sendAmount} = this.state;
    const address = this.state.address;
    const addressUpperCase = address ? address.toUpperCase() : '';
    const sendToUpperCase = sendTo ? sendTo.toUpperCase() : '';

    return this.isAddress(sendTo)
      && parseFloat(this.state.account.balance) >= parseFloat(sendAmount)
      && sendAmount > 0
      && sendToUpperCase !== addressUpperCase;
  };

  isAddress = (address) => {
    return address && address.length === 40;
  };

  isAppHashPasswordValid = () => {

    const {createAppHashPassword} = this.state;

    let schema = new passwordValidator();

    schema
    .is().min(6)                                    // Minimum length 8
    .is().max(20)                                  // Maximum length 20
    .has().not().spaces()                           // Should not have spaces

    return createAppHashPassword && schema.validate(createAppHashPassword);
  };

  changeNetwork = async () => {
    const {networkInSelection} = this.state;
    this.setState({
      network: networkInSelection,
      networkOpen: false
    }, () => {
      this.clear();
    });

  };

  //**************************
  //*****Render Functions*****
  //**************************

  renderDashboard() {
    if (!this.state.account) {
      return (
        <div>
          <LinearProgress/>
        </div>
      );
    }
    const balance = this.state.account.balance;
    const price = this.state.price;
    const accounts = this.state.accounts;
    const identicon = 'data:image/png;base64,' + this.state.identicon;

    return (
      <div className="cards">
        <Card className="card sign-in-card">
          <div className="address align-right">
            <img className='identicon' src={identicon} alt="identicon"/> {this.getAddressAbv(this.state.address)}
            <Tooltip title="Switch Accounts">
              <IconButton aria-label="Switch Accounts"
                          aria-owns={this.state.anchorEl ? 'menuAccountsSelection' : null}
                          aria-haspopup="true"
                          onClick={this.handleAccountsOpen}>
                <PermIdentity/>
              </IconButton>
            </Tooltip>

            <Menu
              id='menuAccountsSelection'
              anchorEl={this.state.anchorEl}
              open={this.state.accountsOpen}
              onClose={this.handleAccountsClose.bind(this, null)}
            >
              {accounts.map(option => (
                <MenuItem key={option.account}
                          selected={option.address === this.state.address}
                          onClick={this.handleAccountsClose.bind(this, option.account)}>
                  {option.address}
                </MenuItem>
              ))}

              <MenuItem key='import'
                        onClick={this.handleAccountsCloseImport}>
                Import Account
              </MenuItem>
            </Menu>
          </div>
          <div className="logo-container">
            <Tooltip title="Reload Account Details">
              <img src={logoZIL} alt="Zilliqa" className="token-logo" onClick={this.reloadAccountDetails}/>
            </Tooltip>
          </div>

          <div className="balance">{balance} ZIL</div>
          {price && <div className="price">${price.price} <span
            className={price.percent_change_24h > 0 ? "green" : "red"}> {price.percent_change_24h > 0 ? "+" : ""}{price.percent_change_24h}%</span>
          </div>}

          <div className="balance">Address

            <Tooltip title="Show Private Key">
              <IconButton aria-label="Details" onClick={this.showKey}>
                <VpnKey/>
              </IconButton>
            </Tooltip>
            <div className="address"> {this.state.address}</div>
          </div>

        </Card>
      </div>
    )
  }

  async loadQRCode() {
    const qrcode = await QRCode.toDataURL(this.state.address);
    this.setState({qrcode});
  }

  goToExplorerAddress = () => {
    window.open(`${this.getExplorerAddress()}${this.state.address}`, '_blank');
  };

  showReceive = () => {
    this.setState({receiveOpen: true});
  };

  handleReceiveClose = () => {
    this.setState({receiveOpen: false});
  };

  showSend = () => {
    this.setState({sendOpen: true});
  };

  handleSendClose = () => {
    this.setState({sendOpen: false});
  };

  showKey = () => {
    this.setState({keyOpen: true});
  };

  handleKeyClose = () => {
    this.setState({keyOpen: false});
  };

  handleCopyToClipBoard = () => {
    this.setState({
      isLoading: false,
      snackbarOpen: true,
      snackbarMessage: 'Copied to clipboard.'
    });
  };


  handleNetworkClose = () => {
    this.setState({networkOpen: false});
  };

  showNetwork = () => {
    const {network} = this.state;
    this.setState({networkOpen: true, networkInSelection: network});
  };

  handleBackupPrivateKeyClose = () => {
    this.setState({
      backupPrivateKeyOpen: false,
    })
  };

  showImportPrivateKey = () => {
    this.setState({importPrivateKeyOpen: true});
  };

  handleImportPrivateKeyClose = () => {
    this.setState({importPrivateKeyOpen: false});
  };

  showImportMnemonic = () => {
    this.setState({importMnemonicOpen: true});
  };

  handleImportMnemonicClose = () => {
    this.setState({importMnemonicOpen: false});
  };

  handleAccountsOpen = (event) => {
    this.setState({accountsOpen: true});
    this.setState({anchorEl: event.currentTarget});
  };

  handleAccountsClose = async (value) => {
    this.setState({accountsOpen: false});
    this.setState({anchorEl: null});

    // set activeAccounts
    let accounts = this.state.accounts;
    let passwordHash = this.state.passwordHash
    if (accounts && passwordHash) {

      let activeAccount = null;
      for (var i = 0; i < this.state.accounts.length; i++) {
        if (this.state.accounts[i].account === value) {
          activeAccount = this.state.accounts[i];
        }
      }
      if (!activeAccount) {
        activeAccount = this.state.accounts[0];
      }

      if (activeAccount) {
        this.setState({activeAccount});

        await this.setActiveAccountBackgroundPage(activeAccount); // set background

        let privateKey = (AES.decrypt(activeAccount.account, passwordHash)).toString(CryptoJS.enc.Utf8);
        await this.setActivePrivateKeyBackgroundPage(privateKey);

        await this.loadActiveAccount();

      }

    }

  };

  handleAccountsCloseImport = () => {
    this.setState({accountsOpen: false});
    this.setState({anchorEl: null});
    this.setState({importOpen: true});
  };

  showHome = () => {
    this.setState({importOpen: false});
  };

  handleResetWalletOpen = () => {
    this.setState({resetWalletOpen: true});
  };

  handleResetWalletClose = () => {
    this.setState({resetWalletOpen: false});
  };

  getAddressAbv = (address) => {
    if (address) {
      return address.substr(0, 5) + '...' + address.substr(address.length - 4, 4);
    } else {
      return '';
    }
  };

  getTxAbv = (tx) => {
    if (tx) {
      return tx.substr(0, 5) + '...' + tx.substr(tx.length - 4, 4);
    } else {
      return 'pending...';
    }
  };

  renderNetwork() {
    return (
      <Dialog
        aria-labelledby="switch-network-title"
        open={this.state.networkOpen}
        onClose={this.handleNetworkClose}
        TransitionComponent={Transition}>
        <div>

          <DialogTitle id="switch-network-title">Switch network</DialogTitle>
          <DialogContent>
            <RadioGroup
              ref={ref => {
                this.radioGroupRef = ref;
              }}
              aria-label="Network"
              name="network"
              value={this.state.networkInSelection}
              onChange={this.handleChange('networkInSelection')}
            >
              <FormControlLabel disabled value='MAINNET' key='MAINNET' control={<Radio/>} label='Mainnet'/>
              <FormControlLabel value='TESTNET' key='TESTNET' control={<Radio/>} label='Testnet'/>
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleNetworkClose} color="primary">
              Cancel
            </Button>
            <Button variant="outlined" onClick={this.changeNetwork} color="secondary">
              Ok
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  }

  renderResetWallet() {
    return (
      <Dialog
        aria-labelledby="switch-network-title"
        open={this.state.resetWalletOpen}
        onClose={this.handleResetWalletClose}
        TransitionComponent={Transition}>
        <div>

          <DialogTitle id="switch-network-title">Reset wallet?</DialogTitle>
          <DialogContent>
            <div>
              <span className="red">Warning: Reset wallet will remove imported accounts!</span>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleResetWalletClose} color="primary">
              Cancel
            </Button>
            <Button variant="outlined" onClick={this.resetAppHashPassword} color="warning">
              Reset
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  }

  renderSend() {
    if (!this.state.account) {
      return null;
    }

    if (!this.state.sendGasPrice) {
      this.setState({sendGasPrice: 1});
    }

    if (!this.state.sendGasLimit) {
      this.setState({sendGasLimit: 1});
    }

    return (
      <Dialog
        fullScreen
        open={this.state.sendOpen}
        onClose={this.handleSendClose}
        TransitionComponent={Transition}>
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={this.handleSendClose} aria-label="Close">
                <CloseIcon/>
              </IconButton>
            </Tooltip>
            <Typography variant="title" color="inherit">
              Send
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Card className="card send-card">
            <TextField
              required
              label="To Address"
              className="send-to"
              value={this.state.sendTo}
              onChange={this.handleChange('sendTo')}
              margin="normal"/>
            <TextField
              required
              label="Zil Amount"
              className="send-amount"
              value={this.state.sendAmount}
              onChange={(ev) => this.setSendAmount(ev.target.value)}
              margin="normal"
              type="number"
              placeholder="0.00"/>
            <TextField
              required
              label="Gas Price"
              className="send-amount"
              value={this.state.sendGasPrice}
              onChange={(ev) => this.setSendGasPrice(ev.target.value)}
              margin="normal"
              type="number"
              placeholder="0.00"/>
            <TextField
              required
              label="Gas Limit"
              className="send-amount"
              value={this.state.sendGasLimit}
              onChange={(ev) => this.setSendGasLimit(ev.target.value)}
              margin="normal"
              type="number"
              placeholder="0.00"/>
            <Button
              id="send-token-button"
              className="send-token-button"
              variant="raised"
              color="secondary"
              disabled={!this.isSendValid()}
              onClick={this.sendToken}>
              Send <Send className="send-button-icon"/>
            </Button>
          </Card>
        </div>
      </Dialog>
    )
  }

  renderReceive() {
    if (!this.state.account) {
      return null;
    }
    if (!this.state.qrcode) {
      this.loadQRCode();
    }

    return (
      <Dialog
        fullScreen
        open={this.state.receiveOpen}
        onClose={this.handleReceiveClose}
        TransitionComponent={Transition}>
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={this.handleReceiveClose} aria-label="Close">
                <CloseIcon/>
              </IconButton>
            </Tooltip>
            <Typography variant="title" color="inherit">
              Receive
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Card className="card account-details-card">
            <Typography variant="title">
              Send to this address
            </Typography>
            {
              this.state.qrcode &&
              <img src={this.state.qrcode} style={{width: '50%'}} alt="account address" className="m-1"/>
            }
            <div className="account-details-address">
              <div className="address">{this.state.address}
                <CopyToClipboard text={this.state.address} onCopy={() => this.handleCopyToClipBoard()}>
                  <IconButton>
                    <FileCopyIcon/>
                  </IconButton>
                </CopyToClipboard>
              </div>
            </div>
          </Card>
        </div>
      </Dialog>
    )
  }

  renderShowKey() {
    if (!this.state.privateKey) {
      return null;
    }

    let privateKey = this.state.privateKey;

    let publicKey = this.state.publicKey;

    return (
      <Dialog
        fullScreen
        open={this.state.keyOpen}
        onClose={this.handleKeyClose}
        TransitionComponent={Transition}>
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={this.handleKeyClose} aria-label="Close">
                <CloseIcon/>
              </IconButton>
            </Tooltip>
            <Typography variant="title" color="inherit">
              Keys
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Card className="card">

            <div className="balance">Private Key
              <CopyToClipboard text={privateKey} onCopy={() => this.handleCopyToClipBoard()}>
                <IconButton>
                  <FileCopyIcon/>
                </IconButton>
              </CopyToClipboard>
            </div>
            <div className="key">{privateKey}</div>

          </Card>

          <Card className="card">

            <div className="balance">Public Key
              <CopyToClipboard text={publicKey} onCopy={() => this.handleCopyToClipBoard()}>
                <IconButton>
                  <FileCopyIcon/>
                </IconButton>
              </CopyToClipboard>
            </div>
            <div className="key">{publicKey}</div>

          </Card>
        </div>
      </Dialog>
    )
  }

  renderSendReceiveButtons() {
    if (!this.state.account) {
      return null;
    }

    return (
      <div className="buttons-container">
        <Button variant="raised" color="secondary" onClick={this.showReceive}>
          Receive <AttachMoney className="receive-button-icon"/>
        </Button>
        <Button variant="raised" color="secondary" onClick={this.showSend}>
          Send <Send className="send-button-icon"/>
        </Button>
      </div>
    )
  }

  renderBackupPrivateKey() {
    let mnemonic = this.state.mnemonic;
    return (
      <Dialog
        open={this.state.backupPrivateKeyOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-slide-title">
          Backup mnemonic
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <span className="red">Please write down your mnemonic , in case you need to restore account later</span>
            <br/>
            <br/>
            <span className="private-key">{mnemonic}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleBackupPrivateKeyClose} color="secondary">
            I have written down the Mnemonic
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  renderTransactions() {
    const {transactions, account} = this.state;
    if (typeof transactions === 'undefined' || typeof account === 'undefined') {
      return null;
    }
    return (
      <Card className="card transactions-card">
        <Typography variant="title">
          Transactions
        </Typography>
        {this.renderTransactionsTable()}
      </Card>
    )
  }

  renderTransactionsTable() {
    const {transactions} = this.state;
    if (!transactions || transactions.length === 0) {
      return (
        <p>No transactions found!</p>
      );
    }

    return (
      <div>
        <Table className="transactions-table">
          <TableHead>
            <TableRow>
              <TableCell className="transactions-time-hash">Time/Hash</TableCell>
              <TableCell className="transactions-addresses">To</TableCell>
              <TableCell className="transactions-amount" numeric>Amount</TableCell>
              <TableCell className="transactions-token">Token</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          </TableBody>
        </Table>
        <div className="view-transactions-on-button">
          <Button size="small" color="secondary" onClick={this.goToExplorerAddress}>
            View transactions
          </Button>
        </div>
      </div>
    )
  }

  handleSnackbardClose = () => {
    this.setState({snackbarOpen: false});
  };

  renderSnackbar() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.snackbarOpen}
        autoHideDuration={3000}
        onClose={this.handleSnackbardClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.snackbarMessage}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleSnackbardClose}
          >
            <CloseIcon/>
          </IconButton>,
        ]}
      >
      </Snackbar>
    )
  }


  renderWallet() {
    return (
      <div className="cards">
        {this.renderDashboard()}
        {this.renderSendReceiveButtons()}
        {this.renderTransactions()}

        {this.renderReceive()}
        {this.renderSend()}
        {this.renderShowKey()}
        {this.renderBackupPrivateKey()}
      </div>
    )
  }

  renderCreateWallet() {
    return (
      <div className="cards">
        <Card className="card sign-in-card">

          <div className="logo-container">
            <Tooltip title="Zilliqa">
              <img src={logoZIL} alt="Zilliqa" className="token-logo-lg"/>
            </Tooltip>
          </div>
          <div className="space"></div>

          <Typography variant="title">
            {this.state.walletLabel}
          </Typography>
          <TextField
            label="Password"
            className="private-key-field"
            type="password"
            autoComplete="off"
            value={this.state.createAppHashPassword}
            onChange={this.handleChange('createAppHashPassword')}
            helperText="Your password (6-20 characters)"
            margin="normal"/>
          <Button
            className="sign-in-button button"
            color="secondary"
            variant="raised"
            disabled={!this.isAppHashPasswordValid()}
            onClick={this.createAppHashPassword}>
            {this.state.walletLabel} <AccountBalanceWallet className="account-details-button-icon"/>
          </Button>

          <div className="space"></div>
          {this.state.walletInitialised && <Button
            className="reset-button button"
            color="warning"
            size="small"
            onClick={this.handleResetWalletOpen}>Reset Wallet
          </Button>
          }

          <div className="space"></div>
        </Card>
      </div>
    )
  }

  renderImportOrCreate() {
    return (

      <div className="cards">
        <Card className="card sign-in-card">

          <div className="logo-container">
            <Tooltip title="Zilliqa">
              <img src={logo} alt="Zilliqa" className="token-logo-lg"/>
            </Tooltip>
          </div>
          <div className="space"></div>
          <Typography variant="title">
            Import By
          </Typography>
          <div className="space"></div>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Button
                className="sign-in-button button"
                color="secondary"
                variant="raised"
                onClick={this.showImportPrivateKey}>
                Private Key <VpnKey className="account-details-button-icon"/>
              </Button>
              <div className="space"></div>
            </Grid>
            <Grid item xs={6}>
              <Button
                className="sign-in-button button"
                color="secondary"
                variant="raised"
                onClick={this.showImportMnemonic}>
                Mnemonic <SpeakerNotes className="account-details-button-icon"/>
              </Button>
              <div className="space"></div>
            </Grid>
          </Grid>

        </Card>

        <Card className="card sign-in-card">
          <div className="space"></div>
          <Typography variant="title">
            Create account
          </Typography>
          <div className="space"></div>
          <Button
            className="sign-in-button button"
            color="secondary"
            variant="raised"
            onClick={this.createAccount}>
            Create account <AccountBalanceWallet className="account-details-button-icon"/>
          </Button>
          <div className="space"></div>
        </Card>
      </div>
    )
  }

  renderImportByPrivateKey() {

    return (
      <Dialog
        fullScreen
        aria-labelledby="switch-network-title"
        open={this.state.importPrivateKeyOpen}
        onClose={this.handleImportyPrivateKeyClose}
        TransitionComponent={Transition}>
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={this.handleImportPrivateKeyClose} aria-label="Close">
                <CloseIcon/>
              </IconButton>
            </Tooltip>
            <Typography variant="title" color="inherit">
              Import by Private Key
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="cards">
          <Card className="card sign-in-card">

            <Typography variant="title">
              Enter private key
            </Typography>
            <p className="token-power-description">Private key is encrypted and only stored in local Chrome storage</p>
            <TextField
              label="Private key"
              className="private-key-field"
              type="password"
              autoComplete="off"
              value={this.state.importPrivateKey}
              onChange={this.handleChange('importPrivateKey')}
              helperText=""
              margin="normal"/>
            <Button
              className="sign-in-button button"
              color="secondary"
              variant="raised"
              disabled={!this.isPrivateKeyValid()}
              onClick={this.importPrivateKey}>
              Import <LockOpen className="account-details-button-icon"/>
            </Button>
            <div class="space"></div>
          </Card>
        </div>
      </Dialog>
    )
  }

  renderImportByMnemonic() {
    return (
      <Dialog
        fullScreen
        aria-labelledby="switch-network-title"
        open={this.state.importMnemonicOpen}
        onClose={this.handleImportMnemonicClose}
        TransitionComponent={Transition}>
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={this.handleImportMnemonicClose} aria-label="Close">
                <CloseIcon/>
              </IconButton>
            </Tooltip>
            <Typography variant="title" color="inherit">
              Sign in by Mnemonic
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="cards">
          <Card className="card sign-in-card">

            <Typography variant="title">
              Mnemonic
            </Typography>
            <p className="token-power-description">Restore from <b>Mnemonic</b>, private key is encryptd and only stored
              in local Chrome storage</p>
            <TextField
              label="Mnemonic"
              className="private-key-field"
              autoComplete="off"
              multiLine={true}
              value={this.state.importMnemonic}
              onChange={this.handleChange('importMnemonic')}
              helperText=""
              margin="normal"/>
            <Button
              className="sign-in-button button"
              color="secondary"
              variant="raised"
              disabled={!this.isMnemonicValid()}
              onClick={this.importMnemonic}>
              Import <SpeakerNotes className="account-details-button-icon"/>
            </Button>
            <div class="space"></div>
          </Card>
        </div>
      </Dialog>
    )
  }

  renderMainScreen() {
    if (this.state.passwordHash) {
      if (this.state.importOpen) {
        return this.renderImportOrCreate();

      } else {
        if (this.state.privateKey) {
          return this.renderWallet();
        }
      }

    } else {
      return this.renderCreateWallet();
    }
  }

  signOut = () => {
    this.clear();
  };

  renderAppBar() {
    return (
      <AppBar position="sticky">
        <Toolbar>
          <div className="tool-bar">
            <div className="logo-container">
              <img src={logo} className="app-logo" alt="logo"/>
              <h3>
                Zilliqa Light Wallet
              </h3>
            </div>
            <div>
              {this.state.network && this.state.passwordHash &&

              <Tooltip title="Home">
                <IconButton color="inherit" onClick={this.showHome} aria-label="Home">
                  <Dashboard className="account-details-button-icon"/>
                </IconButton>
              </Tooltip>
              }

              {this.state.network &&

              <Tooltip title="Network">
                <IconButton color="inherit" onClick={this.showNetwork} aria-label="Network">
                  <Wifi className="account-details-button-icon"/>
                </IconButton>
              </Tooltip>
              }

              {this.state.passwordHash &&

              <Tooltip title="Sign out">
                <IconButton color="inherit" onClick={this.signOut} aria-label="Sign out">
                  <Launch className="account-details-button-icon"/>
                </IconButton>
              </Tooltip>
              }
            </div>
          </div>
        </Toolbar>
      </AppBar>
    )
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          {this.renderAppBar()}
          {this.renderMainScreen()}

          {this.renderImportByPrivateKey()}
          {this.renderImportByMnemonic()}
          {this.renderNetwork()}
          {this.renderResetWallet()}
          {this.renderSnackbar()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
