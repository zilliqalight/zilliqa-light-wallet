import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid/Grid';

import Dashboard from './Dashboard';
import SendButton from './SendButton';
import ReceiveButton from './ReceiveButton';
import SendToken from './SendToken';
import ReceiveToken from './ReceiveToken';
import Transactions from './Transactions';

class Wallet extends Component {
  render() {
    return (
      <div>
        <Dashboard />
        <div className="buttons-container">
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <SendButton />
            </Grid>
            <Grid item xs={6}>
              <ReceiveButton />
            </Grid>
          </Grid>
        </div>
        <SendToken />
        <ReceiveToken />
        <Transactions />
      </div>
    );
  }
}

export default connect()(Wallet);
