import React, { Component } from 'react';

class ModeSelect  extends Component{
  render () {
    return (
      <div>
      		<button className="btn-select">
      			Single Player Mode
      		</button>
      		<button className="btn-select">
      			Play with Friends
      		</button>
      </div>
    )
  }
}
export default ModeSelect