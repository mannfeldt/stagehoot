import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import CountdownAnimation from '../../../common/CountdownAnimation';

class SpotifyStarting extends Component {
  constructor(props) {
    super(props);
    this.startCounter();
    this.nextPhase = this.nextPhase.bind(this);
  }

  startCounter() {
    const that = this;
    let counter = 5;
    const i = setInterval(() => {
      counter -= 1;
      if (counter === 0) {
        that.nextPhase();
        clearInterval(i);
      }
    }, 1000);
    return 5;
  }

  nextPhase() {
    const { game, gameFunc } = this.props;
    // Generera frågor och svar. viktigt att göra detta i ett svep. vill inte behöva använda spotify api under spelets gång för att riskera att token har expirat
    // ALT 1
    // alla frågor och svar genereras här och sparas till firebase
    // då kan jag läsa upp frågorna en i taget likt speltypen quiz och gå till resultQuestion componenten
    // ALT 2
    // Alla frågor genereras i spotify.js utan att sparas till firebase
    // då måste resultquiz componenten vara en child-component till spotify.js.
    // spotify.js visas både i phase gameplay och level_complete då och om det är level_complete så renderars childcomponent resultquiz

    game.phase = 'gameplay';
    gameFunc.update(game);
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
SpotifyStarting.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default SpotifyStarting;
