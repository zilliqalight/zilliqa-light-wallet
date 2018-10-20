import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { DEFAULT_NETWORK } from '../utils/networks';
import { localStorage } from '../utils/localStorage';
import { backgroundPage } from '../utils/backgroundPage';

import Transition from './Transition';

import { resetSnackbar, showSnackbar } from '../actions/snackbar';
import { hideWalletReset, resetWallet } from '../actions/wallet';
import { resetAccount } from '../actions/account';
import { resetApp, setNetwork } from '../actions/app';
import { resetAppBar } from '../actions/appBar';
import { resetDashboard } from '../actions/dashboard';

class WalletReset extends React.Component {
  resetWallet = () => {
    const {
      showSnackbar,
      hideWalletReset,
      resetAccount,
      resetApp,
      resetAppBar,
      resetDashboard,
      resetSnackbar,
      resetWallet,
      setNetwork,
    } = this.props;
    localStorage.setPasswordHash(null);
    localStorage.setAccounts(null);
    localStorage.setNetwork(null);

    backgroundPage.setPasswordHash(null);
    backgroundPage.setActiveAccount(null);

    resetAccount();
    resetApp();
    resetAppBar();
    resetDashboard();
    resetSnackbar();
    resetWallet();

    setNetwork(DEFAULT_NETWORK);

    showSnackbar('Wallet reset successfully!');
    hideWalletReset();
  };
  render() {
    const { open, hideWalletReset } = this.props;
    return (
      <Dialog
        aria-labelledby="switch-network-title"
        open={open}
        onClose={hideWalletReset}
        TransitionComponent={Transition}
      >
        <div>
          <DialogTitle id="switch-network-title">Reset wallet?</DialogTitle>
          <DialogContent>
            <div>
              <span className="red">
                Warning: Reset wallet will remove all imported accounts from
                this wallet, you need to use either private key or mnemonic to
                import them again!
              </span>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={hideWalletReset} color="primary">
              Cancel
            </Button>
            <Button variant="outlined" onClick={this.resetWallet}>
              Reset
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.walletResetOpen,
});

const mapDispatchToProps = {
  hideWalletReset,
  showSnackbar,
  resetAccount,
  resetApp,
  resetAppBar,
  resetDashboard,
  resetSnackbar,
  resetWallet,
  setNetwork,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletReset);
