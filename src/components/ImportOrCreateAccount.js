import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';
import VpnKey from '@material-ui/icons/VpnKey';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import PermIdentity from '@material-ui/icons/PermIdentity';

import logo from '../images/logo.png';
import {
  showCreateAccount,
  showImportMnemonic,
  showImportPrivateKey,
} from '../actions/wallet';
import ImportPrivateKey from './ImportPrivateKey';
import ImportMnemonic from './ImportMnemonic';
import CreateAccount from './CreateAccount';

const ImportOrCreateAccount = ({
  showImportPrivateKey,
  showImportMnemonic,
  showCreateAccount,
}) => (
  <div>
    <div className="cards">
      <Card className="card sign-in-card">
        <div className="logo-container">
          <Tooltip title="Zilliqa">
            <img src={logo} alt="Zilliqa" className="token-logo-lg" />
          </Tooltip>
        </div>
        <div className="space" />
        <Typography variant="h6">Import By</Typography>
        <div className="space" />
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Button
              className="sign-in-button button"
              color="secondary"
              variant="contained"
              onClick={showImportPrivateKey}
            >
              Private Key <VpnKey className="account-details-button-icon" />
            </Button>
            <div className="space" />
          </Grid>
          <Grid item xs={6}>
            <Button
              className="sign-in-button button"
              color="secondary"
              variant="contained"
              onClick={showImportMnemonic}
            >
              Mnemonic <SpeakerNotes className="account-details-button-icon" />
            </Button>
            <div className="space" />
          </Grid>
        </Grid>
      </Card>
      <Card className="card sign-in-card">
        <div className="space" />
        <Typography variant="h6">Create account</Typography>
        <div className="space" />
        <Button
          className="sign-in-button button"
          color="secondary"
          variant="contained"
          onClick={showCreateAccount}
        >
          Create account{' '}
          <PermIdentity className="account-details-button-icon" />
        </Button>
        <div className="space" />
      </Card>
    </div>
    <ImportPrivateKey />
    <ImportMnemonic />
    <CreateAccount />
  </div>
);

const mapDispatchToProps = {
  showImportPrivateKey,
  showImportMnemonic,
  showCreateAccount,
};

export default connect(
  null,
  mapDispatchToProps
)(ImportOrCreateAccount);
