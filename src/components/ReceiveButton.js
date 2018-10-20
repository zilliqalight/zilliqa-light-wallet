import React from 'react';

import Button from '@material-ui/core/Button/Button';
import AttachMoney from '@material-ui/icons/AttachMoney';
import connect from 'react-redux/es/connect/connect';

import { showReceiveToken } from '../actions/wallet';

const ReceiveButton = ({ showReceiveToken }) => (
  <Button variant="contained" color="secondary" onClick={showReceiveToken}>
    Receive <AttachMoney className="receive-button-icon" />
  </Button>
);

const mapDispatchToProps = {
  showReceiveToken,
};

export default connect(
  null,
  mapDispatchToProps
)(ReceiveButton);
