import React, { Component } from 'react';
import { connect } from 'react-redux';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import {
  SCREEN_IMPORT_OR_CREATE_ACCOUNT,
  SCREEN_CREATE_WALLET,
  setAppSalt,
  setNetwork,
  setScreen,
  setPasswordHash,
  SCREEN_WALLET,
} from '../actions/app';
import { setAccountInfo } from '../actions/account';
import customTheme from './customTheme';
import { localStorage } from '../utils/localStorage';
import { backgroundPage } from '../utils/backgroundPage';
import AppBar from './WalletAppBar';
import Snackbar from './WalletSnackbar';
import RoutingScreen from './RoutingScreen';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.initWallet();
  }

  initWallet = async () => {
    const {
      setAppSalt,
      setNetwork,
      setPasswordHash,
      setScreen,
      setAccountInfo,
    } = this.props;

    const appSalt = await localStorage.getOrCreateAppSalt();
    setAppSalt(appSalt);

    const network = await localStorage.getNetworkOrDefault();
    setNetwork(network);

    const passwordHashInBackground = await backgroundPage.getPasswordHash();
    const passwordHashInStorage = await localStorage.getPasswordHash();
    setPasswordHash(passwordHashInBackground, passwordHashInStorage);

    const accounts = await localStorage.getAccounts();
    let activeAccount = await backgroundPage.getActiveAccount();
    if (!activeAccount && accounts && accounts.length > 0) {
      activeAccount = accounts[0];
      await backgroundPage.setActiveAccount(activeAccount);
    }
    setAccountInfo(accounts, activeAccount);

    if (!!passwordHashInBackground) {
      if (accounts && accounts.length > 0) {
        setScreen(SCREEN_WALLET);
      } else {
        setScreen(SCREEN_IMPORT_OR_CREATE_ACCOUNT);
      }
    } else {
      setScreen(SCREEN_CREATE_WALLET);
    }
  };

  render() {
    return (
      <MuiThemeProvider theme={customTheme}>
        <div className="App">
          <AppBar />
          <RoutingScreen />
          <Snackbar />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  screen: state.app.screen,
  appSalt: state.app.appSalt,
  network: state.app.network,
  passwordHashInBackground: state.app.passwordHashInBackground,
  passwordHashInStorage: state.app.passwordHashInStorage,
  accounts: state.account.accounts,
  activeAccount: state.app.activeAccount,
});

const mapDispatchToProps = {
  setAppSalt,
  setNetwork,
  setPasswordHash,
  setScreen,
  setAccountInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
