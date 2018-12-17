import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Transition from './Transition';

import { hideWalletBackup } from '../actions/wallet';
import { showSnackbar } from '../actions/snackbar';

class WalletBackup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAgreed: false,
    };
  }

  render() {
    const { open, mnemonic, hideWalletBackup } = this.props;
    const { hasAgreed } = this.state;
    if (!mnemonic) {
      return null;
    }

    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Backup mnemonic</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <span className="red">
              Please write down your mnemonic , in case you need to restore
              account later
            </span>
            <br />
            <br />
            <span className="private-key">{mnemonic}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="backup-wallet-confirmation">
          <FormControlLabel
            control={
              <Checkbox
                checked={hasAgreed}
                onChange={event =>
                  this.setState({ hasAgreed: event.target.checked })
                }
                value="dense"
              />
            }
            label="I have written down the Mnemonic"
          />
          <Button
            onClick={hideWalletBackup}
            color="secondary"
            disabled={!hasAgreed}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.wallet.walletBackupOpen,
  mnemonic: state.wallet.mnemonic,
  activeAccount: state.account.activeAccount,
  network: state.app.network,
});

const mapDispatchToProps = {
  hideWalletBackup,
  showSnackbar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletBackup);
