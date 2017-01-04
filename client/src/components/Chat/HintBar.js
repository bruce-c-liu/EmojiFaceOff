import React, { Component } from 'react';
import Hint from './Hint';

class HintBar  extends Component{
  render () {
  	const {hintInfo} = this.props;
  	const hints = hintInfo.solution.map((item, idx) => {
  	  return <Hint key={idx} hint={item} />;
  	});
  	const hintNum = hintInfo.solution.length >= 1 ? `${hintInfo.solution.length} Emoji for this one` : null;
    return (
      <div className="hint-bar">
      		<button className='btn-hint'
      		  onClick={(e)=>this.props.clickHint(e)}
      		  disabled={hintInfo.clueCount >= hintInfo.solution.length} > ?</button>
	      <div className='hint-wrap'>
	      		{hintInfo.solution.length >= 1 
	      			? <span className="hint-count">HINT: </span>
	      			: null}	      		
	        	{hints}
	        	<span className="hint-count">{hintNum}</span>
	      
	      </div>
      </div>
    )
  }
}
export default HintBar