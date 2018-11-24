import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import CountdownAnimation from '../../common/CountdownAnimation';

class PhaseStarting extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.nextPhase = this.nextPhase.bind(this);
    this.startCounter();
  }

  startCounter() {
    const that = this;
    const counter = 5;
    const i = setInterval(() => {
      that.setState(state => ({
        counter: state.counter + 1,
      }));


      if (counter === 0) {
        that.nextPhase();
        clearInterval(i);
      }
    }, 1000);
    return 5;
  }

  nextPhase() {
    this.props.gameFunc.update({ phase: 'gameplay' });
  }

  render() {
    return (
      <div className="phase-container">
        <Typography variant="h2">Starting game</Typography>
        <CountdownAnimation speed="slow" />
      </div>
    );
  }
}

export default PhaseStarting;
