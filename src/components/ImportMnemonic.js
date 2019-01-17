import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Dialog from '@material-ui/core/Dialog/Dialog';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField/TextField';
import LockOpen from '@material-ui/icons/LockOpen';
import Button from '@material-ui/core/Button/Button';

import AES from 'crypto-js/aes';

import { verifyPrivateKey, getAddressFromPrivateKey } from '@zilliqa-js/crypto';

import { isMnemonicValid, mnemonicToPrivateKey } from '../utils/crypto';
import { backgroundPage } from '../utils/backgroundPage';
import { localStorage } from '../utils/localStorage';

import Transition from './Transition';

import { hideImportMnemonic, importMnemonic } from '../actions/wallet';
import { showSnackbar } from '../actions/snackbar';
import { setAccountInfo } from '../actions/account';
import { SCREEN_WALLET, setScreen } from '../actions/app';

class ImportMnemonic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: '',
    };
  }

  disableSubmit = () => {
    return !isMnemonicValid(this.state.mnemonic);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.importMnemonic();
  };

  importMnemonic = async () => {
    const {
      setAccountInfo,
      hideImportMnemonic,
      showSnackbar,
      setScreen,
    } = this.props;
    const { mnemonic } = this.state;

    if (!isMnemonicValid(mnemonic)) {
      showSnackbar('Invalid mnemonic! Please try again.');
      return;
    }

    const privateKey = mnemonicToPrivateKey(mnemonic).toUpperCase();
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
    showSnackbar('Mnemonic imported successfully!', true);
    setScreen(SCREEN_WALLET);

    hideImportMnemonic();
  };

  render() {
    const { hideImportMnemonic, open } = this.props;
    const { mnemonic } = this.state;
    return (
      <Dialog
        fullScreen
        aria-labelledby="switch-network-title"
        open={open}
        onClose={hideImportMnemonic}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={hideImportMnemonic}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" color="inherit">
              Import Mnemonic
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="cards">
          <Card className="card sign-in-card">
            <Typography variant="h6">Enter Mnemonic</Typography>
            <p className="token-power-description">
              Restore from <b>Mnemonic</b>, private key is encrypted and only
              stored in local Chrome storage
            </p>
            <TextField
              name="mnemonic"
              label="Mnemonic"
              className="private-key-field"
              autoComplete="off"
              value={mnemonic}
              onChange={this.handleChange}
              helperText=""
              margin="normal"
            />
            <Button
              className="sign-in-button button"
              color="secondary"
              variant="contained"
              disabled={this.disableSubmit()}
              onClick={this.handleSubmit}
            >
              Import <LockOpen className="account-details-button-icon" />
            </Button>
            <div className="space" />
          </Card>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.importMnemonicOpen,
});

const mapDispatchToProps = {
  hideImportMnemonic,
  importMnemonic,
  setAccountInfo,
  showSnackbar,
  setScreen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportMnemonic);
