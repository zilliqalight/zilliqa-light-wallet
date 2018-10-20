import React from 'react';

import loadPrice from '../utils/loadPrice';

export default class Price extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadPrice();
  }

  loadPrice = async () => {
    const price = await loadPrice();
    this.setState({ price });
  };

  render() {
    const { price } = this.state;
    if (!price) {
      return null;
    }

    const percent = price.percent_change_24h;
    return (
      <div className="price">
        ${price.price}{' '}
        <span className={percent > 0 ? 'green' : 'red'}>
          {' '}
          {percent > 0 ? '+' : ''}
          {percent}%
        </span>
      </div>
    );
  }
}
