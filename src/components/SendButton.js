import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button/Button';
import Send from '@material-ui/icons/Send';

import { showSendToken } from '../actions/wallet';

const SendButton = ({ showSendToken }) => (
  <Button size="small" variant="contained" color="secondary" onClick={showSendToken}>
    Send <Send className="send-button-icon" />
  </Button>
);

const mapDispatchToProps = {
  showSendToken,
};

export default connect(
  null,
  mapDispatchToProps
)(SendButton);
