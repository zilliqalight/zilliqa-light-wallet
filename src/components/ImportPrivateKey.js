import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import AES from 'crypto-js/aes';

import { verifyPrivateKey, getAddressFromPrivateKey } from '@zilliqa-js/crypto';

import { hideImportPrivateKey, importPrivateKey } from '../actions/wallet';
import Dialog from '@material-ui/core/Dialog/Dialog';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField/TextField';
import LockOpen from '@material-ui/icons/LockOpen';
import Transition from './Transition';
import { isPrivateKeyValid } from '../utils/crypto';
import { backgroundPage } from '../utils/backgroundPage';
import { localStorage } from '../utils/localStorage';
import { showSnackbar } from '../actions/snackbar';
import { setAccountInfo } from '../actions/account';
import { SCREEN_WALLET, setScreen } from '../actions/app';

class ImportPrivateKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
    };
  }

  disableSubmit = () => {
    return !isPrivateKeyValid(this.state.privateKey);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.importPrivateKey();
  };

  importPrivateKey = async () => {
    const {
      setAccountInfo,
      hideImportPrivateKey,
      showSnackbar,
      setScreen,
    } = this.props;
    const { privateKey } = this.state;

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
    showSnackbar('Private key imported successfully!', true);
    setScreen(SCREEN_WALLET);

    hideImportPrivateKey();
  };

  render() {
    const { hideImportPrivateKey, open } = this.props;
    const { privateKey } = this.state;
    return (
      <Dialog
        fullScreen
        aria-labelledby="switch-network-title"
        open={open}
        onClose={hideImportPrivateKey}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={hideImportPrivateKey}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" color="inherit">
              Import Private Key
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="cards">
          <Card className="card sign-in-card">
            <Typography variant="h6">Enter private key</Typography>
            <p className="token-power-description">
              Private key is encrypted and only stored in local Chrome storage
            </p>
            <TextField
              name="privateKey"
              label="Private key"
              className="private-key-field"
              type="password"
              autoComplete="off"
              value={privateKey}
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
  open: state.wallet.importPrivateKeyOpen,
});

const mapDispatchToProps = {
  hideImportPrivateKey,
  importPrivateKey,
  setAccountInfo,
  showSnackbar,
  setScreen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportPrivateKey);
