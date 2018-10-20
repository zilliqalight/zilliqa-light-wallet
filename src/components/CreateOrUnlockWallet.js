import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet';
import logoZIL from '../images/logo_zil.svg';
import TextField from '@material-ui/core/TextField/TextField';

import passwordValidator from 'password-validator';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

import { backgroundPage } from '../utils/backgroundPage';
import { localStorage } from '../utils/localStorage';

import WalletReset from './WalletReset';

import { showSnackbar } from '../actions/snackbar';
import {
  SCREEN_IMPORT_OR_CREATE_ACCOUNT,
  SCREEN_WALLET,
  setPasswordHash,
  setScreen,
} from '../actions/app';
import { showWalletReset } from '../actions/wallet';

class CreateOrUnlockWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };

    this.disableSubmit = this.disableSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  disableSubmit() {
    return !this.isAppPasswordValid(this.state.password);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { walletCreated } = this.props;
    if (walletCreated) {
      this.validatePassword();
    } else {
      this.createPasswordHash();
    }
  }

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

  createPasswordHash = async () => {
    const { password } = this.state;
    const { setPasswordHash, showSnackbar, setScreen } = this.props;

    const appSalt = await localStorage.getOrCreateAppSalt();

    // Save `passwordSHA256` to local storage
    const passwordSHA256 = SHA256(password).toString();
    await localStorage.setPasswordHash(passwordSHA256);

    // Save `passwordSHA512` to background
    const passwordSHA512 = SHA512(password, appSalt).toString();
    const passwordHashInBackground = await backgroundPage.setPasswordHash(
      passwordSHA512
    );

    setPasswordHash(passwordHashInBackground, passwordSHA256);

    setScreen(SCREEN_IMPORT_OR_CREATE_ACCOUNT);
    showSnackbar(
      'Password created, please use it to unlock your wallet later.'
    );
  };

  validatePassword = async () => {
    const { setScreen, showSnackbar, accounts, setPasswordHash } = this.props;
    const { password } = this.state;

    const passwordHashInStorage = await localStorage.getPasswordHash();
    const enteredPasswordSHA256 = SHA256(password).toString();

    const passwordValid =
      passwordHashInStorage && enteredPasswordSHA256 === passwordHashInStorage;
    if (passwordValid) {
      const appSalt = await localStorage.getOrCreateAppSalt();

      // Save `passwordSHA512` to background
      const passwordSHA512 = SHA512(password, appSalt).toString();
      const passwordHashInBackground = await backgroundPage.setPasswordHash(
        passwordSHA512
      );
      setPasswordHash(passwordHashInBackground, passwordHashInStorage);

      if (accounts.length > 0) {
        setScreen(SCREEN_WALLET);
      } else {
        setScreen(SCREEN_IMPORT_OR_CREATE_ACCOUNT);
      }
    } else {
      showSnackbar('Invalid password, please try again.');
    }
  };

  render() {
    const { walletCreated, showWalletReset } = this.props;
    const walletLabel = walletCreated ? 'Unlock Wallet' : 'Create Wallet';

    return (
      <div className="cards">
        <Card className="card sign-in-card">
          <div className="logo-container">
            <Tooltip title="Zilliqa">
              <img src={logoZIL} alt="Zilliqa" className="token-logo-lg" />
            </Tooltip>
          </div>
          <div className="space" />

          <Typography variant="h6">{walletLabel}</Typography>
          <TextField
            label="Password"
            className="private-key-field"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            helperText="Your password (6-20 characters)"
            margin="normal"
          />
          <Button
            className="sign-in-button button"
            color="secondary"
            variant="contained"
            disabled={!this.isAppPasswordValid()}
            onClick={this.handleSubmit}
          >
            {walletLabel}{' '}
            <AccountBalanceWallet className="account-details-button-icon" />
          </Button>

          <div className="space" />
          {walletCreated && (
            <Button
              className="reset-button button"
              size="small"
              onClick={showWalletReset}
            >
              Reset Wallet
            </Button>
          )}
          <div className="space" />
        </Card>
        <WalletReset />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  walletCreated: !!state.app.passwordHashInStorage,
  accounts: state.account.accounts,
});

const mapDispatchToProps = {
  showSnackbar,
  setScreen,
  setPasswordHash,
  showWalletReset,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrUnlockWallet);
