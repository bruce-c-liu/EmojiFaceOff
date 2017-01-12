import CircularProgressbar from 'react-circular-progressbar';
import React, { Component } from 'react';

class ProgressBar extends React.Component {
 constructor(props) {
   super(props);

   this.state = {
     currentPercentage: 0,
   };
 }

 componentDidUpdate() {
    if(this.state.currentPercentage < 95){
      setTimeout(() => {
        this.setState({
          currentPercentage: this.state.currentPercentage + 5 
        });
      }, 500);
    }
 }

 render() {
   return <CircularProgressbar {...this.props}  percentage={this.state.currentPercentage} />;
 }
}

export default ProgressBar;