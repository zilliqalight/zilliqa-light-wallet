import React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import withStyles from '@material-ui/core/styles/withStyles';
import Snackbar from '@material-ui/core/Snackbar';

import { hideSnackbar } from '../actions/snackbar';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: '#303f9f',
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

const MySnackbarContentWrapper = withStyles(styles)(MySnackbarContent);

const WalletSnackbar = ({ open, message, isSuccess, hideSnackbar }) => (
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
  >
    <MySnackbarContentWrapper
      variant={isSuccess ? 'success' : 'info'}
      message={message}
      onClose={hideSnackbar}
    />
  </Snackbar>
);

const mapStateToProps = state => ({
  open: state.snackbar.snackbarOpen,
  message: state.snackbar.snackbarMessage,
  isSuccess: state.snackbar.snackbarSuccess,
});

const mapDispatchToProps = {
  hideSnackbar,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletSnackbar);
