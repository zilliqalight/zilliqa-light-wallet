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

import loadQRCode from '../utils/loadQRCode';

import Transition from './Transition';

import { hideReceiveToken } from '../actions/wallet';
import { showSnackbar } from '../actions/snackbar';

class ReceiveToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initQRCode();
  }

  initQRCode = async () => {
    const { activeAccount } = this.props;
    const qrCode = await loadQRCode(activeAccount.address);
    this.setState({ qrCode });
  };

  handleCopyToClipBoard = () => {
    const { showSnackbar } = this.props;
    showSnackbar('Address copied to clipboard.');
  };

  render() {
    const { activeAccount, open, hideReceiveToken } = this.props;
    const { qrCode } = this.state;
    const { address } = activeAccount;

    if (!activeAccount || !qrCode || !address) {
      return null;
    }

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={hideReceiveToken}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={hideReceiveToken}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" color="inherit">
              Receive
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Card className="card account-details-card">
            <Typography variant="h6">Send to this address</Typography>
            {qrCode && (
              <img src={qrCode} alt="account address" className="qr-code" />
            )}
            <div className="account-details-address">
              <div className="address">
                {address}
                <CopyToClipboard
                  text={address}
                  onCopy={this.handleCopyToClipBoard}
                >
                  <IconButton>
                    <FileCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              </div>
            </div>
          </Card>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.receiveTokenOpen,
  activeAccount: state.account.activeAccount,
});

const mapDispatchToProps = {
  hideReceiveToken,
  showSnackbar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiveToken);
