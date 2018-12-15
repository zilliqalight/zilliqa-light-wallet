import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

import { backgroundPage } from '../utils/backgroundPage';
import { localStorage } from '../utils/localStorage';
import { createZilliqa } from '../utils/networks';

import { hideAccounts, showAccounts } from '../actions/dashboard';
import { hideSnackbar, showSnackbar } from '../actions/snackbar';
import { setActiveAccountDetails, setAccountInfo } from '../actions/account';
import { SCREEN_IMPORT_OR_CREATE_ACCOUNT, setScreen } from '../actions/app';

class AccountsMenu extends Component {
  loadAccounts = async () => {
    let accounts = await localStorage.getAccounts();
    this.setState({
      accounts: accounts,
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open && this.props.open) {
      this.setState({
        open: this.props.open,
        anchorEl: this.props.anchorEl,
      });
    }
  }

  handleAccountsCloseImport = () => {
    const { hideAccounts, setScreen } = this.props;

    hideAccounts();
    setScreen(SCREEN_IMPORT_OR_CREATE_ACCOUNT);
  };

  handleAccountsClose = async value => {
    const {
      accounts,
      hideAccounts,
      network,
      showSnackbar,
      hideSnackbar,
      setAccountInfo,
      setActiveAccountDetails,
    } = this.props;

    if (value) {
      // set activeAccounts
      const passwordHash = await backgroundPage.getPasswordHash();
      if (accounts && passwordHash) {
        let activeAccount = null;
        for (const account of accounts) {
          if (account.encryptedPrivateKey === value) {
            activeAccount = account;
          }
        }
        if (!activeAccount) {
          activeAccount = accounts[0];
        }

        if (activeAccount) {
          showSnackbar('Account is switched successfully!', true);

          await backgroundPage.setActiveAccount(activeAccount); // set background

          hideAccounts();

          if (activeAccount && activeAccount.address) {
            showSnackbar('Loading account details...');
            const zilliqa = createZilliqa(network);
            try {
              const data = await zilliqa.blockchain.getBalance(
                activeAccount.address
              );
              if (data.error) {
                console.error(data.error);
              } else {
                const activeAccountDetails = data.result;
                setActiveAccountDetails(activeAccountDetails);
                setAccountInfo(accounts, activeAccount);
                hideSnackbar();
              }
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          showSnackbar('Fail to switch account.');
          hideAccounts();
        }
      } else {
        showSnackbar('Fail to switch account.');
        hideAccounts();
      }
    } else {
      hideAccounts();
    }
  };

  render() {
    const { anchorEl, open, activeAccount, accounts } = this.props;

    if (!accounts) {
      return null;
    }

    return (
      <Menu
        id="menuAccountsSelection"
        anchorEl={anchorEl}
        open={open}
        onClose={this.handleAccountsClose.bind(this, null)}
      >
        {accounts.map(option => (
          <MenuItem
            key={option.encryptedPrivateKey}
            selected={option.address === activeAccount.address}
            onClick={this.handleAccountsClose.bind(
              this,
              option.encryptedPrivateKey
            )}
          >
            {option.address}
          </MenuItem>
        ))}

        <MenuItem key="import" onClick={this.handleAccountsCloseImport}>
          Import Account
        </MenuItem>
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  open: state.dashboard.accountsOpen,
  anchorEl: state.dashboard.anchorEl,
  activeAccount: state.account.activeAccount,
  activeAccountDetails: state.account.activeAccountDetails,
  network: state.app.network,
  accounts: state.account.accounts,
});

const mapDispatchToProps = {
  showAccounts,
  hideAccounts,
  setAccountInfo,
  setActiveAccountDetails,
  showSnackbar,
  hideSnackbar,
  setScreen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountsMenu);
