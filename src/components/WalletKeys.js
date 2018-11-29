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
    this.state = {};
  }

  componentDidMount() {
    this.getKeys();
  }

  getKeys = async () => {
    const { activeAccount } = this.props;
    const { encryptedPrivateKey } = activeAccount;
    const privateKey = await getActivePrivateKey(encryptedPrivateKey);
    const publicKey = getPubKeyFromPrivateKey(privateKey).toUpperCase();
    console.log(`privateKey:${privateKey}`);

    const account = new Account(privateKey);
    const keystore = await account.toFile('stronk_password');

    console.log('downloadData start')
    await localStorage.downloadData(keystore);
    console.log('downloadData complete')

    this.setState({ keystore, publicKey });
  };

  handleCopyToClipBoard = () => {
    const { showSnackbar } = this.props;
    showSnackbar('Copied to clipboard.');
  };

  render() {
    const { open, hideWalletKeys } = this.props;
    const { keystore, publicKey } = this.state;
    if (!keystore || !publicKey) {
      return null;
    }

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
              Keys
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Card className="card">
            <div className="balance">
              keystore
              <CopyToClipboard
                text={keystore}
                onCopy={this.handleCopyToClipBoard}
              >
                <IconButton>
                  <FileCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </div>
            <div className="key">{keystore}</div>
          </Card>

          <Card className="card">
            <div className="balance">
              Public Key
              <CopyToClipboard
                text={publicKey}
                onCopy={this.handleCopyToClipBoard}
              >
                <IconButton>
                  <FileCopyIcon />
                </IconButton>
              </CopyToClipboard>
            </div>
            <div className="key">{publicKey}</div>
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
