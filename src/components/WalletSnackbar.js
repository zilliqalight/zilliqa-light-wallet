import React from 'react';
import { connect } from 'react-redux';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { hideSnackbar } from '../actions/snackbar';

const WalletSnackbar = ({ open, message, hideSnackbar }) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    open={open}
    autoHideDuration={3000}
    onClose={hideSnackbar}
    ContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">{message}</span>}
    action={[
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={hideSnackbar}
      >
        <CloseIcon />
      </IconButton>,
    ]}
  />
);

const mapStateToProps = state => ({
  open: state.snackbar.snackbarOpen,
  message: state.snackbar.snackbarMessage,
});

const mapDispatchToProps = {
  hideSnackbar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletSnackbar);
