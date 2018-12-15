import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PermIdentity from '@material-ui/icons/PermIdentity';

import AES from 'crypto-js/aes';

import {
  schnorr,
  verifyPrivateKey,
  getAddressFromPrivateKey,
} from '@zilliqa-js/crypto';

import { generateMnemonicFromString } from '../utils/crypto';
import { localStorage } from '../utils/localStorage';
import { backgroundPage } from '../utils/backgroundPage';

import { hideCreateAccount } from '../actions/wallet';
import { showSnackbar } from '../actions/snackbar';
import { setAccountInfo } from '../actions/account';
import { SCREEN_WALLET, setScreen } from '../actions/app';
import { showWalletBackup } from '../actions/wallet';

import Transition from './Transition';

const  {
  generatePrivateKey,
} = schnorr;

class CreateAccount extends Component {
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.createAccount();
  };

  createAccount = async () => {
    const {
      setAccountInfo,
      hideCreateAccount,
      showSnackbar,
      setScreen,
      showWalletBackup,
    } = this.props;

    const privateKey = generatePrivateKey().toUpperCase();
    if (!verifyPrivateKey(privateKey)) {
      showSnackbar('Invalid private key! Please try again.');
      return;
    }

    const address = getAddressFromPrivateKey(privateKey).toUpperCase();
    const passwordHashInBackground = await backgroundPage.getPasswordHash();
    const accounts = await localStorage.getAccounts();
    const encryptedPrivateKey = AES.encrypt(
      privateKey,
      passwordHashInBackground
    ).toString();

    const accountExisted =
      accounts.filter(account => account.address === address).length > 0;
    if (accountExisted) {
      showSnackbar('Account already exists! Please import another one.');
      return;
    }

    const activeAccount = {
      address,
      encryptedPrivateKey,
    };

    accounts.push(activeAccount);
    await localStorage.setAccounts(accounts);

    await backgroundPage.setActiveAccount(activeAccount);
    setAccountInfo(accounts, activeAccount);
    showSnackbar('Account is created successfully!');

    let mnemonic = generateMnemonicFromString(privateKey);
    showWalletBackup(mnemonic);
    setScreen(SCREEN_WALLET);

    hideCreateAccount();
  };

  render() {
    const { hideCreateAccount, open } = this.props;
    return (
      <Dialog
        fullScreen
        aria-labelledby="switch-network-title"
        open={open}
        onClose={hideCreateAccount}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={hideCreateAccount}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" color="inherit">
              Create Account
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="cards">
          <Card className="card sign-in-card">
            <Typography variant="h6">Create New Account on Zilliqa</Typography>
            <p className="token-power-description">
              Private key is encrypted and only stored in local Chrome storage
            </p>

            <Button
              className="sign-in-button button"
              color="secondary"
              variant="contained"
              onClick={this.handleSubmit}
            >
              Create <PermIdentity className="account-details-button-icon" />
            </Button>
            <div className="space" />
          </Card>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.createAccountOpen,
});

const mapDispatchToProps = {
  hideCreateAccount,
  setAccountInfo,
  showSnackbar,
  setScreen,
  showWalletBackup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);
