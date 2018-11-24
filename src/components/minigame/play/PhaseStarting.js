import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

class PhaseStarting extends Component {
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
          <Typography variant="h5">Starting game...</Typography>
        </div>
        <div className="quiz-bottom-section" />
      </div>
    );
  }
}

export default PhaseStarting;
