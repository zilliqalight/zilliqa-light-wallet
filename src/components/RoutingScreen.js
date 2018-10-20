import React from 'react';
import { connect } from 'react-redux';

import UnlockWallet from './UnlockWallet';
import Wallet from './Wallet';
import ImportOrCreateAccount from './ImportOrCreateAccount';
import CreateWallet from './CreateWallet';

import { showNetwork } from '../actions/appBar';
import {
  SCREEN_CREATE_WALLET,
  SCREEN_IMPORT_OR_CREATE_ACCOUNT,
  SCREEN_UNLOCK_WALLET,
  SCREEN_WALLET,
} from '../actions/app';

const RoutingScreen = ({ screen }) => {
  switch (screen) {
    case SCREEN_UNLOCK_WALLET:
      return <UnlockWallet />;
    case SCREEN_WALLET:
      return <Wallet />;
    case SCREEN_CREATE_WALLET:
      return <CreateWallet />;
    case SCREEN_IMPORT_OR_CREATE_ACCOUNT:
      return <ImportOrCreateAccount />;
    default:
      return null;
  }
};

const mapStateToProps = state => ({
  screen: state.app.screen,
});

const mapDispatchToProps = {
  showNetwork,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutingScreen);
