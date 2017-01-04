import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

class CoinStore extends Component {
  constructor () {
    super();
    this.state = {

    };
  }

  onToken (token) {
    axios.post('/api/chargeUser', {
      token: token,
      fbId: this.props.users.authedId
    }).then(token => {
      console.log(`We are in business, ${token.email}`);
    });
  }

  componentWillMount () {
    console.log(this.props.users.authedId);
  }

  render () {
    return (

      <div className='inner-container is-center'>
        <div className='mode-select_wrap'>
          <h1> VERY COIN STORE!</h1>
          <div>
            <h3>Corn Doge Pack!</h3>
            <h6>$1 for 1000 coins</h6>
            <div className='mode-select_vs'>
              <div className='avatar is-md' style={{backgroundImage: `url('https://s-media-cache-ak0.pinimg.com/originals/3d/c2/b0/3dc2b0128647de48ca0e02f02c535068.jpg')`}} />
            </div>
            <StripeCheckout
              currency='USD'
              name='Corn Doge Pack'
              description='1000 coins'
              panelLabel='Buy!'
              token={this.onToken.bind(this)}
              stripeKey='pk_test_vHCSYegt2uT5wbb0EoaJeLDL'
             />
          </div>

          <div>
            <h3>Hot Doge Pack!</h3>
            <h6>$5 for 7500 coins</h6>
            <div className='mode-select_vs'>
              <div className='avatar is-md' style={{backgroundImage: `url('http://i.imgur.com/76yFaur.jpg')`}} />
            </div>
            <StripeCheckout
              currency='USD'
              name='Hot Doge Pack'
              description='5000 coins'
              panelLabel='Buy!'
              token={this.onToken.bind(this)}
              stripeKey='pk_test_vHCSYegt2uT5wbb0EoaJeLDL'
             />
          </div>

          <div>
            <h3>Space Doge Pack!</h3>
            <h6>$10 for 16,000 coins</h6>
            <div className='mode-select_vs'>
              <div className='avatar is-md' style={{backgroundImage: `url('http://cdn30.us1.fansshare.com/image/wallpaper1920x1080/doge-twinkie-doge-in-space-space-wallpaper-1264491839.jpg')`}} />
            </div>
            <StripeCheckout
              currency='USD'
              name='Space Doge Pack'
              description='16,000 coins'
              panelLabel='Buy!'
              token={this.onToken.bind(this)}
              stripeKey='pk_test_vHCSYegt2uT5wbb0EoaJeLDL'
             />
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

