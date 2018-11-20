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
      sendGasLimit: 10,
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
      activeAccount,
    } = this.props;

    const zilliqa = createZilliqa(network);

    const { encryptedPrivateKey } = activeAccount;
    const privateKey = await getActivePrivateKey(encryptedPrivateKey);

    try {
      // Populate the wallet with an account
      zilliqa.wallet.addByPrivateKey(privateKey);
      showSnackbar(
        'Submitting send transaction, please wait.'
      );

      const tx = await zilliqa.blockchain.createTransaction(
        zilliqa.transactions.new({
          version: 1,
          toAddr: sendTo,
          amount: new BN(sendAmount),
          gasPrice: new BN(sendGasPrice),
          gasLimit: new BN(sendGasLimit),
        })
      );
      if (tx.error) {
        console.error(tx.error);
        this.setState({ isLoading: false });
        showSnackbar(`Send failed, ${tx.error}, please retry later.`);
      } else {
        console.log('tx:', tx);
        this.setState({ isLoading: true });
        showSnackbar(
          'Send transaction created, please refresh your account to check.'
        );
        hideSendToken();
      }
    } catch (error) {
      this.setState({ isLoading: false });
      console.error(error);
      showSnackbar(`Send failed, ${error}, please retry later.`);
    }
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
