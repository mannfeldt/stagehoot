import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

class PhaseFinalResult extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="phase-container">
        <div className="quiz-top-section" />
        <div className="quiz-middle-section">
          <Typography variant="h5">Look at the screen. playerKey</Typography>
        </div>
        <div className="quiz-bottom-section" />
      </div>
    );
  }
}

export default PhaseFinalResult;
