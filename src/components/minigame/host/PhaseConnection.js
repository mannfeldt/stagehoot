import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

class PhaseConnection extends Component {
  constructor(props) {
    super(props);
    this.nextPhase = this.nextPhase.bind(this);
  }

  nextPhase() {
    const { gameFunc } = this.props;
    gameFunc.update({ phase: 'starting' });
  }

  render() {
    const { game } = this.props;
    let { players } = game;
    if (!players) {
      players = [];
    } else {
      players = Object.values(players);
    }
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Typography variant="h2">
            <span>Join game with Game PIN: </span>
            <span className="dynamic-text">{game.gameId}</span>
          </Typography>
          {game.gametype === 'golf'
            ? <Typography variant="h4" style={{ marginTop: 40 }}>mannfeldt.github.io/golf</Typography>
            : <Typography variant="h4" style={{ marginTop: 40 }}>mannfeldt.github.io/stagehoot</Typography>
          }
          <Typography variant="subtitle1" style={{ marginTop: 20 }}>{game.title}</Typography>
        </div>
        <div className="quiz-middle-section">
          <Grid container>
            {players.map(player => (
              <Grid key={player.key} item xs={3}>
                <Typography paragraph variant="body1" className="dynamic-text">{player.name}</Typography>
              </Grid>
            ))}
          </Grid>
        </div>
        <div className="quiz-bottom-section">
          <Button onClick={this.nextPhase} variant="contained">Start</Button>
        </div>
      </div>
    );
  }
}
PhaseConnection.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default PhaseConnection;
