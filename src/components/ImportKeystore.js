import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import CreateNewFolder from '@material-ui/icons/CreateNewFolder';

import AES from 'crypto-js/aes';

import { Account } from '@zilliqa-js/account';
import { verifyPrivateKey, getAddressFromPrivateKey } from '@zilliqa-js/crypto';

import { hideImportKeystore, importKeystore } from '../actions/wallet';
import Dialog from '@material-ui/core/Dialog/Dialog';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Transition from './Transition';
import { isPrivateKeyValid } from '../utils/crypto';
import { backgroundPage } from '../utils/backgroundPage';
import { localStorage } from '../utils/localStorage';
import { showSnackbar } from '../actions/snackbar';
import { setAccountInfo } from '../actions/account';
import { SCREEN_WALLET, setScreen } from '../actions/app';
import TextField from '@material-ui/core/TextField/TextField';
import passwordValidator from 'password-validator';

class ImportKeystore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  disableSubmit = () => {
    return !this.isAppPasswordValid(this.state.password);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isAppPasswordValid = () => {
    const { password } = this.state;
    const schema = new passwordValidator();
    schema
      .is()
      .min(6) // Minimum length 6
      .is()
      .max(20) // Maximum length 20
      .has()
      .not()
      .spaces(); // Should not have spaces

    return password && schema.validate(password);
  };

  importKeystore = async event => {
    console.log(event.target.files[0]);
    debugger;
    const {
      setAccountInfo,
      hideImportKeystore,
      showSnackbar,
      setScreen,
    } = this.props;
    const account = Account.fromFile(
      event.target.files[0],
      this.state.password
    ); // Throw error
    const privateKey = account.privateKey;

    if (!verifyPrivateKey(privateKey)) {
      showSnackbar('Invalid keystore file! Please try again.');
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
    showSnackbar('Keystore file imported successfully!');
    setScreen(SCREEN_WALLET);

    hideImportKeystore();
  };

  render() {
    const { hideImportPrivateKey, open } = this.props;
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
              Import Keystore file
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="cards">
          <Card className="card sign-in-card">
            <Typography variant="h6">Upload Keystore file</Typography>
            <p className="token-power-description">
              The imported key will be encrypted and only stored in local Chrome
              storage
            </p>
            <TextField
              label="Password"
              className="private-key-field"
              type="password"
              autoComplete="off"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              helperText="Your passphrase (6-20 characters)"
              margin="normal"
            />
            <input
              accept="text/plain"
              id="keystore-file"
              multiple
              type="file"
              onInput={this.importKeystore}
            />
            <label id="import-keystore" htmlFor="keystore-file">
              <Button
                color="secondary"
                variant="contained"
                component="span"
                className="import-keystore-button button"
              >
                Import keystore file{' '}
                <CreateNewFolder className="account-details-button-icon" />
              </Button>
            </label>
            <div className="space" />
          </Card>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.importKeystoreOpen,
});

const mapDispatchToProps = {
  hideImportKeystore,
  importKeystore,
  setAccountInfo,
  showSnackbar,
  setScreen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportKeystore);
