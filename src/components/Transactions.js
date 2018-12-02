import React from 'react';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import orangeAvatar from '@material-ui/core/colors/deepOrange';
import greenAvatar from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';

import moment from 'moment';

import loadTransactions from '../utils/loadTransactions';
import { getAddressAbbreviation, getTxAbbreviation } from '../utils/crypto';

const EXPLORER_ADDRESS_URL = 'https://viewblock.io/zilliqa/address/';
const EXPLORER_TX_URL = 'https://viewblock.io/zilliqa/tx/';
const styles = {
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    fontSize: 8,
    width: 25,
    height: 25,
    backgroundColor: orangeAvatar[500],
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    fontSize: 8,
    width: 25,
    height: 25,
    backgroundColor: greenAvatar[500],
  },
};

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { activeAccount } = this.props;
    this.loadTransactions(activeAccount.address);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.activeAccount !== prevProps.activeAccount) {
      this.loadTransactions(this.props.activeAccount.address);
    }
  }

  loadTransactions = async address => {
    const transactions = await loadTransactions(address);
    this.setState({ transactions });
  };

  goToExplorerAddress = () => {
    const { activeAccount } = this.props;
    window.open(`${EXPLORER_ADDRESS_URL}${activeAccount.address}?network=testnetv3`, '_blank');
  };

  renderAvatarColor(from, to) {
    const { activeAccount } = this.props;
    if (activeAccount.address === to.toUpperCase()) {
      return styles.greenAvatar;
    }
    return styles.orangeAvatar;
  }

  renderAvatar(from, to) {
    const { activeAccount } = this.props;
    if (activeAccount.address === to.toUpperCase()) {
      return 'IN';
    }
    return 'OUT';
  }

  renderFromOrTo(from, to) {
    const { activeAccount } = this.props;
    if (activeAccount.address === to.toUpperCase()) {
      return `From: ${getAddressAbbreviation(from)}`;
    }
    return `To: ${getAddressAbbreviation(to)}`;
  }

  renderTransactionsTable() {
    const { transactions } = this.state;
    if (!transactions || transactions.length === 0) {
      return <div className="address">No transactions found!</div>;
    }

    return (
      <div>
        <Table className="transactions-table">
          <TableHead>
            <TableRow>
              <TableCell className="transactions-time-hash">
                Time/Hash
              </TableCell>
              <TableCell className="transactions-in-out" />
              <TableCell className="transactions-addresses">From/To</TableCell>
              <TableCell className="transactions-amount" numeric>
                Amount
              </TableCell>
              <TableCell className="transactions-token">Token</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(transaction => {
              const amount = transaction.value;
              const txURL = `${EXPLORER_TX_URL}${transaction.hash}?network=testnetv3`;
              const avatar = this.renderAvatar(
                transaction.from,
                transaction.to
              );
              const avatarColor = this.renderAvatarColor(
                transaction.from,
                transaction.to
              );
              return (
                <TableRow key={transaction.hash}>
                  <TableCell
                    className="transactions-time-hash"
                    component="th"
                    scope="row"
                  >
                    <Grid container justify="flex-start" alignItems="center">
                      {moment(transaction.timestamp).format(
                        'MMM Do, h:mm:ss a'
                      )}
                      <br />
                      <a
                        href={txURL}
                        className="tx-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getTxAbbreviation(transaction.hash)}
                      </a>
                    </Grid>
                  </TableCell>
                  <TableCell className="transactions-in-out">
                    <Avatar style={avatarColor}>{avatar}</Avatar>{' '}
                  </TableCell>
                  <TableCell className="transactions-addresses">
                    <span>
                      {' '}
                      {this.renderFromOrTo(
                        transaction.from,
                        transaction.to
                      )}{' '}
                    </span>
                  </TableCell>
                  <TableCell className="transactions-amount" numeric>
                    {amount}
                  </TableCell>
                  <TableCell className="transactions-token">ZIL</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="view-transactions-on-button">
          <Button
            size="small"
            color="secondary"
            onClick={this.goToExplorerAddress}
          >
            View all transactions
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { transactions } = this.state;
    if (!transactions) {
      return null;
    }

    return (
      <div className="cards">
        <Card className="card transactions-card">
          {this.renderTransactionsTable()}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeAccount: state.account.activeAccount,
});

export default connect(mapStateToProps)(Transactions);
