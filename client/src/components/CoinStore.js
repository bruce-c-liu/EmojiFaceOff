import React, { Component } from 'react';
import {Motion, spring, presets} from 'react-motion';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import Header from './Header';
import mixpanel from 'mixpanel-browser';

class CoinStore extends Component {
  constructor () {
    super();
    this.state = {
      fbId: '',
      coinPack: ''
    };
  }

  componentWillMount () {
    console.log(this.props.users.authedId);
    this.setState({
      fbId: this.props.users.authedId
    });
  }

  componentDidMount () {
    // this.props.fetchBitlyLink(this.state.longRoomURL);
    mixpanel.track('Nav Coin Store');
  }

  onToken (token) {
    console.log('sending charge', token, this.state);
    if (token && this.state.coinPack.length > 0) {
      axios.post('/api/chargeUser', {
        token: token,
        fbId: this.state.fbId,
        coinPack: this.state.coinPack
      })
      .then(token => {
        console.log('response from server', token);
        if (this.state.coinPack) mixpanel.track(`Bought ${this.state.coinPack} Doge Pack`);
        this.setState({
          coinPack: ''
        });
      })
      .catch(err => {
        throw err;
      });
    }
  }

  handleClick (e, coinPack) {
    e.preventDefault();
    this.setState({
      coinPack: coinPack
    });
    if (this.state.coinPack) mixpanel.track(`Bought ${this.state.coinPack} Doge Pack`);
  }

  render () {
    const {users} = this.props
    return (
      <div className='inner-container is-center is-relative'>
        <Header />
        <div className="store-balance">
          <p>Your Coin Balance: </p>
          <Motion defaultStyle={{x: 0}} style={{x: spring(users.profile.coins)}}>
            {value => <h4>{Math.round(value.x)}</h4>}
          </Motion>
        </div>
        <div className='mode-select_wrap'>


          <h1> Re-up that skrilla</h1>
          <div className="store-items">

              <div className="store-item">
                  <h4>1,000 Coins</h4>
                  <div className="dotted"></div>
                  <StripeCheckout
                    currency='USD'
                    name='Corn Doge Pack'
                    description='1000 coins'
                    panelLabel='Buy!'
                    token={this.onToken.bind(this)}
                    stripeKey='pk_test_vHCSYegt2uT5wbb0EoaJeLDL'
                  >
                    <button className="btn-buy" onClick={e => { this.handleClick(e, 'corn'); }}>$1</button>
                  </StripeCheckout>
              </div>
              <div className="store-item">
                  <h4>7,500 Coins</h4>
                  <div className="dotted"></div>
                  <StripeCheckout
                    currency='USD'
                    name='Hot Doge Pack'
                    description='7,500 coins'
                    panelLabel='Buy!'
                    token={this.onToken.bind(this)}
                    stripeKey='pk_test_vHCSYegt2uT5wbb0EoaJeLDL'
                    >
                    <button className="btn-buy" onClick={e => { this.handleClick(e, 'hot'); }}>$5</button>
                  </StripeCheckout>
              </div>
              <div className="store-item">
                  <h4>16,000 Coins</h4>
                  <div className="dotted"></div>
                  <StripeCheckout
                    currency='USD'
                    name='Space Doge Pack'
                    description='16,000 coins'
                    panelLabel='Buy!'
                    token={this.onToken.bind(this)}
                    stripeKey='pk_test_vHCSYegt2uT5wbb0EoaJeLDL'
                    >
                    <button className="btn-buy" onClick={e => { this.handleClick(e, 'space'); }}>$10</button>
                  </StripeCheckout>
              </div>
          </div>
        </div>
      </div>

    );
  }
}

function mapStateToProps (state) {
  return {
    users: state.users,
    ui: state.ui,
    session: state.session
  };
}
function mapDispachToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispachToProps)(CoinStore);

