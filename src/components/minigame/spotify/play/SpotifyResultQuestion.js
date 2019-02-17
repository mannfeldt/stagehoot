import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

class SpotifyResultQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { game } = this.props;
    return (
      <div className="phase-container">
        <div className="quiz-top-section" />
        <div className="quiz-middle-section" />
        <div className="quiz-bottom-section">
          <Typography variant="subtitle1">Kolla på spelskrämen för att se ställningen</Typography>
        </div>
      </div>
    );
  }
}
SpotifyResultQuestion.propTypes = {
  game: PropTypes.object.isRequired,
  playerKey: PropTypes.string.isRequired,
};
export default SpotifyResultQuestion;
