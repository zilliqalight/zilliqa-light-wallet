import React from 'react';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog/Dialog';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Card from '@material-ui/core/Card/Card';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import Send from '@material-ui/icons/Send';
import BN from 'bn.js';

import { getActivePrivateKey, isAddress } from '../utils/crypto';
import { createZilliqa } from '../utils/networks';

import Transition from './Transition';

import { hideSendToken } from '../actions/wallet';
import { showSnackbar } from '../actions/snackbar';

class SendToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendTo: '',
      sendAmount: 0,
      sendGasPrice: 1,
      sendGasLimit: 1,
      isLoading: false,
    };
  }

  handleAddressChange = event => {
    this.setState({ [event.target.name]: event.target.value.toUpperCase() });
  };

  handleAmountChange = event => {
    const formattedAmount = event.target.value
      .replace(/^0+(?!\.|$)/, '')
      .replace(/[^0-9 .]+/g, '')
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1');

    this.setState({ [event.target.name]: formattedAmount });
  };

  disableSubmit = () => {
    return !this.isSendValid();
  };

  isSendValid = () => {
    const { activeAccount, activeAccountDetails } = this.props;
    if (!activeAccountDetails) {
      return false;
    }
    const { balance } = activeAccountDetails;
    const { address } = activeAccount;
    const { sendTo, sendAmount, isLoading } = this.state;

    return (
      !isLoading &&
      sendTo &&
      isAddress(sendTo) &&
      parseFloat(balance) >= parseFloat(sendAmount) &&
      sendAmount > 0 &&
      sendTo !== address
    );
  };

  sendToken = async () => {
    const { sendTo, sendAmount, sendGasPrice, sendGasLimit } = this.state;
    this.setState({ isLoading: true });

    const {
      network,
      showSnackbar,
      hideSendToken,
      activeAccountDetails,
      activeAccount,
    } = this.props;

    const zilliqa = createZilliqa(network);
    const node = zilliqa.getNode();

    // transaction details
    const txDetails = {
      version: 0,
      nonce: activeAccountDetails.nonce + 1,
      to: sendTo,
      amount: new BN(sendAmount),
      gasPrice: parseFloat(sendGasPrice),
      gasLimit: parseFloat(sendGasLimit),
    };
    console.log('txDetails', txDetails);

    // sign the transaction using util methods
    const { encryptedPrivateKey } = activeAccount;
    const privateKey = await getActivePrivateKey(encryptedPrivateKey);

    const signedTx = zilliqa.util.createTransactionJson(privateKey, txDetails);
    console.log('signedTx:', signedTx);
    node.createTransaction(signedTx, (error, data) => {
      console.log(error);
      console.log(data.error);
      if (error || data.error) {
        console.error(error);
        this.setState({ isLoading: false });
        showSnackbar(`Sent failed, ${error}, please retry later.`);
      } else {
        const tx = data.result;
        console.log('tx:', tx);
        console.log('data:', data);
        this.setState({ isLoading: true });
        showSnackbar(
          `Sent transaction created, please refresh your account to check.`
        );
        hideSendToken();
      }
    });
  };

  render() {
    const { open, hideSendToken, activeAccount } = this.props;
    if (!activeAccount) {
      return null;
    }

    const { sendTo, sendAmount, sendGasPrice, sendGasLimit } = this.state;

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={hideSendToken}
        TransitionComponent={Transition}
      >
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={hideSendToken}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" color="inherit">
              Send
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Card className="card send-card">
            <TextField
              required
              name="sendTo"
              label="To Address"
              className="send-to"
              value={sendTo}
              onChange={this.handleAddressChange}
              margin="normal"
            />
            <TextField
              required
              name="sendAmount"
              label="Zil Amount"
              className="send-amount"
              value={sendAmount}
              onChange={this.handleAmountChange}
              margin="normal"
              type="number"
              placeholder="0.00"
            />
            <TextField
              required
              name="sendGasPrice"
              label="Gas Price"
              className="send-amount"
              value={sendGasPrice}
              onChange={this.handleAmountChange}
              margin="normal"
              type="number"
              placeholder="0.00"
            />
            <TextField
              required
              name="sendGasLimit"
              label="Gas Limit"
              className="send-amount"
              value={sendGasLimit}
              onChange={this.handleAmountChange}
              margin="normal"
              type="number"
              placeholder="0.00"
            />
            <Button
              id="send-token-button"
              className="send-token-button"
              variant="contained"
              color="secondary"
              disabled={this.disableSubmit()}
              onClick={this.sendToken}
            >
              Send <Send className="send-button-icon" />
            </Button>
          </Card>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.sendTokenOpen,
  activeAccount: state.account.activeAccount,
  activeAccountDetails: state.account.activeAccountDetails,
  network: state.app.network,
});

const mapDispatchToProps = {
  hideSendToken,
  showSnackbar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendToken);
