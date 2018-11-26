import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class PhaseFinalResult extends Component {
  constructor(props) {
    super(props);
    this.replayGame = this.replayGame.bind(this);
  }

  replayGame() {
    const { gameFunc } = this.props;
    gameFunc.update({ phase: 'starting' });
  }

  /*
skriv ut vinnaren och hur lång tid gamet tog
(använd minigame.ticks och minigame.difficulty för att räkna ut sekunder)
minigame.winners inner håller vinnare/vinnarna.
kan vara så att winners inte finns om det snakes.length === 1
 men då är ju den "vinnaren". typ i coop singelplayer
podium
  */
  render() {
    const { gameFunc, game } = this.props;
    return (
      <div className="phase-container">
        <div className="quiz-middle-section">
          <Typography variant="h2">Final score</Typography>
          <Typography variant="h2">{game.minigame.winners[0].name}</Typography>
        </div>
        <div className="align-bottom ">
          <div>
            <Button onClick={this.replayGame}>Replay game</Button>
            <Button onClick={gameFunc.restart}>Re-host game</Button>
            <Button onClick={gameFunc.quit}>Quit game</Button>
            <Button onClick={() => alert('show results')}>Show results</Button>
            <Button onClick={() => alert('start survey')}>Start survey</Button>
            <Button>
              <Link to="/create">Create new game</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
PhaseFinalResult.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default PhaseFinalResult;
