import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

export default class Disclaimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDisclaimer: false,
    };
  }

  render() {
    const { showDisclaimer } = this.state;
    return (
      <div>
        {!showDisclaimer && (
          <Button
            id="disclaimer-button"
            size="small"
            onClick={() => this.setState({ showDisclaimer: true })}
          >
            Show Disclaimer
          </Button>
        )}
        {showDisclaimer && (
          <div className="disclaimer">
            <h4>Disclaimer</h4>
            <p>Always be vigilant about safety and security!</p>
            <p>
              Always backup your keys: We do not have access to, nor do we
              store, your keys to the tokens or funds you have on our software.
              No data leaves your computer/phone/browser. We only provide a
              service to make it easy for users to create, save and access
              information that is needed to interact with the blockchain. It is
              your responsibility to securely store and backup your keys.
            </p>
            <p>
              We are not responsible for any loss: The Zilliqa blockchain as
              well as the software are under active development. There is always
              the possibility of something unexpected happening that causes your
              tokens or funds to be lost. Please do not use the software for
              more than what you are willing to lose, and please be careful. By
              using the software, you agree that each of Zilliqa Light Wallet
              and Zilliqa Research Pte Ltd. assume no responsibility or
              liability for any error, omission, delay, damages, costs, loss or
              expense (together “Losses”) incurred by you from the use of the
              software. You acknowledge that you may suffer a Loss from the use
              of the software and that the use of the software is at your own
              risk.
            </p>
            <p>MIT License</p>
            <p>Copyright (c) YEAR Zilliqa Light Wallet</p>
            <p>
              Permission is hereby granted, free of charge, to any person
              obtaining a copy of this software and associated documentation
              files (the "Software"), to deal in the Software without
              restriction, including without limitation the rights to use, copy,
              modify, merge, publish, distribute, sublicense, and/or sell copies
              of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p>
              The above copyright notice and this permission notice shall be
              included in all copies or substantial portions of the Software.
            </p>
            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
              NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.
            </p>
          </div>
        )}
      </div>
    );
  }
}
