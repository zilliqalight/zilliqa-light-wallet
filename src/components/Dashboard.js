import React from 'react';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Card from '@material-ui/core/Card/Card';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import PermIdentity from '@material-ui/icons/PermIdentity';
import VpnKey from '@material-ui/icons/VpnKey';

import { BN, units } from '@zilliqa-js/util';

import {
  getAddressAbbreviation,
  ZeroBalanceUserDetails,
} from '../utils/crypto';
import { getIdenticonImage } from '../utils/identicon';
import { createZilliqa } from '../utils/networks';

import AccountsMenu from './AccountsMenu';
import ChangeNetwork from './ChangeNetwork';
import BackupKeystore from './BackupKeystore';
import WalletBackup from './WalletBackup';
import Price from './Price';

import { hideAccounts, showAccounts } from '../actions/dashboard';
import { hideSnackbar, showSnackbar } from '../actions/snackbar';
import { showBackupKeystore } from '../actions/wallet';
import { setActiveAccountDetails } from '../actions/account';

import logoZIL from '../images/logo_zil.svg';

class Dashboard extends React.Component {
  componentDidMount() {
    this.loadActiveAccountDetails(true);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // When close send token popup
    if (
      !this.props.sendTokenOpen &&
      prevProps.sendTokenOpen !== this.props.sendTokenOpen
    ) {
      this.loadActiveAccountDetails(false);
    }
  }

  showAccounts = async event => {
    const { showAccounts } = this.props;
    showAccounts(event.currentTarget);
  };

  loadActiveAccountDetails = async openSnackbar => {
    const {
      activeAccount,
      network,
      showSnackbar,
      hideSnackbar,
      setActiveAccountDetails,
    } = this.props;
    if (activeAccount && activeAccount.address) {
      if (openSnackbar) {
        showSnackbar('Loading account details...');
      }
      const zilliqa = createZilliqa(network);
      try {
        const data = await zilliqa.blockchain.getBalance(activeAccount.address);
        if (data.error) {
          // If the account is not created, the API returns an error, we need to handle it as a zero balance account
          if (data.error.code === -5) {
            setActiveAccountDetails(ZeroBalanceUserDetails);
            if (openSnackbar) {
              hideSnackbar();
            }
          } else {
            showSnackbar('Failed to load account info, please try again');
            console.error(data.error);
          }
        } else {
          const activeAccountDetails = data.result;
          setActiveAccountDetails(activeAccountDetails);
          if (openSnackbar) {
            hideSnackbar();
          }
        }
      } catch (e) {
        showSnackbar('Failed to load account info, please try again');
        console.error(e);
      }
    }
  };

  render() {
    const { activeAccountDetails } = this.props;
    if (!activeAccountDetails) {
      return (
        <div>
          <LinearProgress />
          <p>Loading the account details...</p>
        </div>
      );
    }

    const { activeAccount, showBackupKeystore } = this.props;
    const { balance } = activeAccountDetails;
    const { address } = activeAccount;
    const identiconImage = getIdenticonImage(address);
    const addressAbbreviation = getAddressAbbreviation(address);

    const balanceInZil = Number(Number(units.fromQa(new BN(balance), units.Units.Zil)).toFixed(6)).toString();

    return (
      <div className="cards">
        <Card className="card sign-in-card">
          <div className="address align-right">
            <img className="identicon" src={identiconImage} alt={address} />{' '}
            {addressAbbreviation}
            <Tooltip title="Switch Accounts">
              <IconButton
                aria-label="Switch Accounts"
                aria-owns="menuAccountsSelection"
                aria-haspopup="true"
                onClick={this.showAccounts}
              >
                <PermIdentity />
              </IconButton>
            </Tooltip>
            <AccountsMenu />
          </div>
          <div className="logo-container">
            <Tooltip title="Reload Account Details">
              <img
                src={logoZIL}
                alt="Zilliqa"
                className="token-logo"
                onClick={this.loadActiveAccountDetails}
              />
            </Tooltip>
          </div>

          <div className="balance">{balanceInZil} ZIL</div>
          <Price />

          <div className="balance">
            Address
            <Tooltip title="Backup Keystore">
              <IconButton aria-label="Details" onClick={showBackupKeystore}>
                <VpnKey />
              </IconButton>
            </Tooltip>
            <div className="address"> {address}</div>
          </div>
        </Card>
        <AccountsMenu />
        <BackupKeystore />
        <ChangeNetwork />
        <WalletBackup />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeAccountDetails: state.account.activeAccountDetails,
  activeAccount: state.account.activeAccount,
  network: state.app.network,
  sendTokenOpen: state.wallet.sendTokenOpen,
  accountsOpen: state.dashboard.accountsOpen,
});

const mapDispatchToProps = {
  showSnackbar,
  hideSnackbar,
  showAccounts,
  hideAccounts,
  setActiveAccountDetails,
  showBackupKeystore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
