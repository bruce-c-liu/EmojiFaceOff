import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators.js';
import { browserHistory } from 'react-router';
import _ from 'lodash';

class ModeSelect extends Component {
  constructor () {
    super();
    this.state = {
      tempUser: null
    };
  }


componentWillMount(){
     const lsItems = Object.keys(localStorage);
     let profKey = null;
      lsItems.forEach( item =>{
         if( _.startsWith(item, 'firebase:authUser')){
            profKey = item      
         }      
      })
      let aValue =localStorage.getItem(profKey);
      this.setState({
        tempUser: JSON.parse(aValue)
      })
  }

  initGameFriends (e) {
    e.preventDefault();
    // socket.emit('create', {});
    console.log('Create Room');
    this.props.fetchRoomId();
  }

  render () {
    // const {users} = this.props
   // const avatarSrc = users.profile.info.avatar
    const avatarBG = {
     backgroundImage: `url(${this.state.tempUser.photoURL})`
   };

    return (
      <div className='inner-container is-center'>
        <div className='mode-select_wrap'>
              <div>
              <div className='mode-select_vs'>
                <div className='avatar is-md' style={avatarBG} />
                <span>vs.</span>
                <div className='avatar is-md' style={{backgroundImage: `url('http://emojipedia-us.s3.amazonaws.com/cache/a5/43/a543b730ddcf70dfd638f41223e3969e.png')`}} />
              </div>

              <button className="btn-login is-full" >
                Single Player Mode
              </button>
            </div>
              <div>
                <div className='mode-select_vs'>
                  <div className='avatar is-md' style={avatarBG} />
                  <span>vs.</span>
                  <div className='avatar is-md' style={{backgroundImage: `url('http://emojipedia-us.s3.amazonaws.com/cache/4b/93/4b932980a0fe8f7ad711a8c2fcc68ce4.png')`}} />
                </div>
                <button className='btn-login is-full' onClick={this.initGameFriends.bind(this)}>
                  Challenge Your Friends!
                </button>
              </div>

            </div>

      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    users: state.users,
    ui: state.ui,
    session: state.session
  };
}
function mapDispachToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispachToProps)(ModeSelect);
