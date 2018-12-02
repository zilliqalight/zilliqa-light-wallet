import React, { Component } from 'react';
import { connect } from 'react-redux';

import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import logo from '../images/logo.png';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Wifi from '@material-ui/icons/Wifi';
import Launch from '@material-ui/icons/Launch';
import Dashboard from '@material-ui/icons/Dashboard';
import AppBar from '@material-ui/core/AppBar/AppBar';

import { backgroundPage } from '../utils/backgroundPage';

import { showNetwork } from '../actions/appBar';
import {
  SCREEN_UNLOCK_WALLET,
  SCREEN_WALLET,
  setPasswordHash,
  setScreen,
} from '../actions/app';

class WalletAppBar extends Component {
  signOut = () => {
    const { setPasswordHash, passwordHashInStorage, setScreen } = this.props;
    backgroundPage.setPasswordHash(null);
    setPasswordHash(null, passwordHashInStorage);
    setScreen(SCREEN_UNLOCK_WALLET);
  };

  showDashboard = () => {
    setScreen(SCREEN_WALLET);
  };

  render() {
    const {
      network,
      activeAccount,
      passwordHashInBackground,
      showNetwork,
    } = this.props;
    return (
      <AppBar position="sticky">
        <Toolbar>
          <div className="tool-bar">
            <div className="logo-container">
              <img src={logo} className="app-logo" alt="logo" />
              <h3>Zilliqa Light Wallet</h3>
            </div>
            <div>
              {passwordHashInBackground && (
                <Tooltip title="Dashboard">
                  <IconButton
                    color="inherit"
                    onClick={this.showDashboard}
                    aria-label="Show Dashboard"
                  >
                    <Dashboard className="account-details-button-icon" />
                  </IconButton>
                </Tooltip>
              )}

              {network &&
                activeAccount &&
                passwordHashInBackground && (
                  <Tooltip title="Network">
                    <IconButton
                      color="inherit"
                      onClick={showNetwork}
                      aria-label="Network"
                    >
                      <Wifi className="account-details-button-icon" />
                    </IconButton>
                  </Tooltip>
                )}

              {passwordHashInBackground && (
                <Tooltip title="Sign out">
                  <IconButton
                    color="inherit"
                    onClick={this.signOut}
                    aria-label="Sign out"
                  >
                    <Launch className="account-details-button-icon" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = state => ({
  network: state.app.network,
  activeAccount: state.account.activeAccount,
  passwordHashInBackground: state.app.passwordHashInBackground,
  passwordHashInStorage: state.app.passwordHashInStorage,
});

const mapDispatchToProps = {
  showNetwork,
  setPasswordHash,
  setScreen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletAppBar);
