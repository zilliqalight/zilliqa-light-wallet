import React from 'react';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog/Dialog';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import Card from '@material-ui/core/Card/Card';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';

import passwordValidator from 'password-validator';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getPubKeyFromPrivateKey } from '@zilliqa-js/crypto';
import { Account } from '@zilliqa-js/account';

import { getActivePrivateKey } from '../utils/crypto';

import Transition from './Transition';

import { hideWalletKeys } from '../actions/wallet';
import { showSnackbar } from '../actions/snackbar';

import { localStorage } from '../utils/localStorage';

class WalletKeys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      activeAccount: this.props.activeAccount
    };
    this.disableSubmit = this.disableSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
   this.setState({activeAccount: this.props.activeAccount});
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.activeAccount !== prevProps.activeAccount) {
      this.setState({activeAccount: this.props.activeAccount});
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  disableSubmit() {
    return !this.isAppPasswordValid(this.state.password);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.password);
    this.downloadData(this.state.password);
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

  downloadData = async (pwd) => {
    
    const { hideWalletKeys } = this.props;
    const { encryptedPrivateKey } = this.state.activeAccount;
    if (!encryptedPrivateKey) {
      return;
    }
    const privateKey = await getActivePrivateKey(encryptedPrivateKey);
   
    const account = new Account(privateKey);
    const keystore = await account.toFile(pwd);

    await localStorage.downloadData(keystore);

    this.state.password = '';

    hideWalletKeys();

  };




  handleCopyToClipBoard = () => {
    const { showSnackbar } = this.props;
    showSnackbar('Copied to clipboard.');
  };

  render() {
    const { open, hideWalletKeys } = this.props;

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={hideWalletKeys}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={hideWalletKeys}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" color="inherit">
              Backup Keystore
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Card className="card">
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
          <Button
            className="sign-in-button button"
            color="secondary"
            variant="contained"
            disabled={!this.isAppPasswordValid()}
            onClick={this.handleSubmit}
          >Download
          </Button>
          </Card>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.walletKeysOpen,
  activeAccount: state.account.activeAccount,
});

const mapDispatchToProps = {
  hideWalletKeys,
  showSnackbar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletKeys);
