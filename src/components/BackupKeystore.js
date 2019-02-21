import React from 'react';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog/Dialog';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import Card from '@material-ui/core/Card/Card';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Account } from '@zilliqa-js/account';

import { getActivePrivateKey, isAppPasswordValid } from '../utils/crypto';

import Transition from './Transition';

import { hideBackupKeystore } from '../actions/wallet';
import { showSnackbar } from '../actions/snackbar';

import { localStorage } from '../utils/localStorage';

class BackupKeystore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      activeAccount: this.props.activeAccount,
    };
    this.disableSubmit = this.disableSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ activeAccount: this.props.activeAccount });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (
      this.props.activeAccount !== prevProps.activeAccount ||
      this.props.reloadAccountNonce !== prevProps.reloadAccountNonce
    ) {
      this.setState({ activeAccount: this.props.activeAccount });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  disableSubmit() {
    return !isAppPasswordValid(this.state.password);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.downloadData(this.state.password);
  }

  downloadData = async pwd => {
    const { hideBackupKeystore, showSnackbar } = this.props;
    const { encryptedPrivateKey } = this.state.activeAccount;
    if (!encryptedPrivateKey) {
      return;
    }
    const privateKey = await getActivePrivateKey(encryptedPrivateKey);

    const account = new Account(privateKey);
    const keystore = await account.toFile(pwd);

    await localStorage.downloadData(keystore);

    this.state.password = '';

    showSnackbar('Downloading keystore file...');

    hideBackupKeystore();
  };

  render() {
    const { open, hideBackupKeystore } = this.props;

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={hideBackupKeystore}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={hideBackupKeystore}
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
          <Card className="card backup-keystore-card">
            <TextField
              label="Passphrase"
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
              id="download-keystore-button"
              className="button"
              color="secondary"
              variant="contained"
              disabled={this.disableSubmit()}
              onClick={this.handleSubmit}
            >
              Download keystore file
            </Button>
          </Card>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.backupKeystoreOpen,
  activeAccount: state.account.activeAccount,
  reloadAccountNonce: state.wallet.reloadAccountNonce,
});

const mapDispatchToProps = {
  hideBackupKeystore,
  showSnackbar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupKeystore);
