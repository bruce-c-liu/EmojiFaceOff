import React, { Component } from 'react';
import Hint from './Hint';
import debounce from 'throttle-debounce/debounce';

class HintBar extends Component {
  render () {
  	const { hintInfo } = this.props;
  	const hints = hintInfo.solution.map((item, idx) => {
  	  return <Hint key={idx} hint={item} />;
  	});
  	const hintNum = hintInfo.solution.length >= 1 ? `${hintInfo.solution.length} Emoji` : null;
    return (
      <div className='hint-bar'>
            {
                this.props.hostStatus && !hintInfo.gameStarted  
                              ? <button className='btn-hint'  onClick={debounce(200,(e) => this.props.clickHint(e))}
                                  disabled={hintInfo.numHintsReceived === hintInfo.solution.length || this.props.coinBal < 30} > HINT</button>
                               : <button className='btn-hint is-green'  onClick={(e) => this.props.startProp(e)} > START GAME</button>
            }
            {
                this.props.coinBal < 30
                                ? <p> Insufficent Coins</p>
                                : <div className='hint-wrap'>
                                      {hints}
                                      <span className='hint-count'>{hintNum}</span>
                                   </div>   
            }
      </div>
    );
  }
}
export default HintBar;
