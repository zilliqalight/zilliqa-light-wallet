import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Transition from './Transition';
import { hideNetwork } from '../actions/appBar';
import { setNetwork } from '../actions/app';
import { localStorage } from '../utils/localStorage';

class ChangeNetwork extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.setState({ networkInSelection: this.props.network });
  }

  handleNetworkChange = event => {
    if (event.target) {
      this.setState({ networkInSelection: event.target.value });
    }
  };

  changeNetwork = () => {
    const { hideNetwork, network, setNetwork } = this.props;
    hideNetwork();

    if (network !== this.state.networkInSelection) {
      setNetwork(this.state.networkInSelection);
      localStorage.setNetwork(this.state.networkInSelection);
    }
  };

  render() {
    const { open, hideNetwork } = this.props;

    return (
      <Dialog
        aria-labelledby="switch-network-title"
        open={open}
        onClose={hideNetwork}
        TransitionComponent={Transition}
      >
        <div>
          <DialogTitle id="switch-network-title">Switch network</DialogTitle>
          <DialogContent>
            <RadioGroup
              aria-label="Network"
              name="network"
              value={this.state.networkInSelection}
              onChange={this.handleNetworkChange}
            >
              <FormControlLabel
                value="MAINNET"
                key="MAINNET"
                control={<Radio />}
                label="Mainnet"
              />
              <FormControlLabel
                value="TESTNET"
                key="TESTNET"
                control={<Radio />}
                label="Testnet"
              />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={hideNetwork} color="primary">
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={this.changeNetwork}
              color="secondary"
            >
              Ok
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: state.appBar.networkOpen,
  network: state.app.network,
});

const mapDispatchToProps = {
  hideNetwork,
  setNetwork,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeNetwork);
