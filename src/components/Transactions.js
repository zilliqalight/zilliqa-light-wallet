import React from 'react';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import moment from 'moment';

import loadTransactions from '../utils/loadTransactions';
import { getAddressAbbreviation, getTxAbbreviation } from '../utils/crypto';

const EXPLORER_ADDRESS_URL = 'https://viewblock.io/zilliqa/address/';
const EXPLORER_TX_URL = 'https://viewblock.io/zilliqa/tx/';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { activeAccount } = this.props;
    this.loadTransactions(activeAccount.address);
  }

  loadTransactions = async address => {
    const transactions = await loadTransactions(address);
    this.setState({ transactions });
  };

  goToExplorerAddress = () => {
    const { activeAccount } = this.props;
    window.open(`${EXPLORER_ADDRESS_URL}${activeAccount.address}`, '_blank');
  };

  renderColor(from, to) {
    const { activeAccount } = this.props;
    if (activeAccount.address === to.toUpperCase()) {
      return 'green';
    }
    return 'red';
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
      return <p>No transactions found!</p>;
    }

    return (
      <div>
        <Table className="transactions-table">
          <TableHead>
            <TableRow>
              <TableCell className="transactions-time-hash">
                Time/Hash
              </TableCell>
              <TableCell className="transactions-addresses">From/To</TableCell>
              <TableCell className="transactions-amount" numeric>
                Amount
              </TableCell>
              <TableCell className="transactions-token">Token</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(transaction => {
              console.log(transaction);
              const amount = transaction.value;
              const txURL = `${EXPLORER_TX_URL}${transaction.hash}`;
              const color = this.renderColor(transaction.from, transaction.to)
              return (
                <TableRow key={transaction.hash}>
                  <TableCell
                    className="transactions-time-hash"
                    component="th"
                    scope="row"
                  >
                    {moment(transaction.timestamp).format('MMM Do, h:mm:ss a')}
                    <br />
                    <br />
                    <a href={txURL} className="tx-link" target="_blank">
                      {getTxAbbreviation(transaction.hash)}
                    </a>
                  </TableCell>
                  <TableCell className="transactions-addresses">
                  <span class={color}> {this.renderFromOrTo(transaction.from, transaction.to)} </span>
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
      <Card className="card transactions-card">
        <Typography>Transactions</Typography>
        {this.renderTransactionsTable()}
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  activeAccount: state.account.activeAccount,
});

export default connect(mapStateToProps)(Transactions);
