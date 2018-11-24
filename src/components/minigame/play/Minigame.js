import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import PhaseFinalResult from './PhaseFinalResult';
import SnakeController from '../snake/SnakeController';
import TetrisController from '../tetris/TetrisController';

class Minigame extends PureComponent {
  render() {
    const {
      game, updatePlayer, playerKey, createPlayer,
    } = this.props;
    const lastPhase = game.phase === 'final_result' || game.phase === 'end';
    switch (game.gametype) {
      case 'snake':
        return (
          <div className="play-container">
            {game.phase === 'connection' && <PhaseConnection game={game} addPlayer={createPlayer} playerKey={playerKey} />}
            {game.phase === 'starting' && <PhaseStarting game={game} updatePlayer={updatePlayer} />}
            {game.phase === 'gameplay' && <SnakeController game={game} updatePlayer={updatePlayer} playerKey={playerKey} />}
            {lastPhase && <PhaseFinalResult game={game} updatePlayer={updatePlayer} playerKey={playerKey} />}
          </div>
        );
      case 'tetris':
        return (
          <div className="play-container">
            {game.phase === 'connection' && <PhaseConnection game={game} addPlayer={createPlayer} playerKey={playerKey} />}
            {game.phase === 'starting' && <PhaseStarting game={game} updatePlayer={updatePlayer} />}
            {game.phase === 'gameplay' && <TetrisController game={game} updatePlayer={updatePlayer} />}
            {lastPhase && <PhaseFinalResult game={game} updatePlayer={updatePlayer} playerKey={playerKey} />}
          </div>
        );
      default:
        return (null);
    }
  }
}
Minigame.propTypes = {
  game: PropTypes.object.isRequired,
  updatePlayer: PropTypes.func.isRequired,
  createPlayer: PropTypes.func.isRequired,
  playerKey: PropTypes.string.isRequired,
};
export default Minigame;
