import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import PhaseFinalResult from './PhaseFinalResult';
import SnakeController from '../snake/SnakeController';
import TetrisController from '../tetris/TetrisController';
import GolfController from '../golf/GolfController';

class Minigame extends PureComponent {
  render() {
    const {
      game, playerKey, createPlayer,
    } = this.props;
    const lastPhase = game.phase === 'final_result' || game.phase === 'end';
    switch (game.gametype) {
      case 'snake':
        return (
          <div className="play-container">
            {game.phase === 'connection' && <PhaseConnection game={game} addPlayer={createPlayer} playerKey={playerKey} />}
            {game.phase === 'starting' && <PhaseStarting game={game} />}
            {game.phase === 'gameplay' && <SnakeController game={game} playerKey={playerKey} />}
            {lastPhase && <PhaseFinalResult game={game} playerKey={playerKey} />}
          </div>
        );
      case 'tetris':
        return (
          <div className="play-container">
            {game.phase === 'connection' && <PhaseConnection game={game} addPlayer={createPlayer} playerKey={playerKey} />}
            {game.phase === 'starting' && <PhaseStarting game={game} />}
            {game.phase === 'gameplay' && <TetrisController game={game} />}
            {lastPhase && <PhaseFinalResult game={game} playerKey={playerKey} />}
          </div>
        );
      case 'golf':
        return (
          <div className="play-container">
            {game.phase === 'connection' && <PhaseConnection game={game} addPlayer={createPlayer} playerKey={playerKey} />}
            {game.phase === 'starting' && <PhaseStarting game={game} />}
            {(game.phase === 'gameplay' || game.phase === 'level_completed') && <GolfController game={game} playerKey={playerKey} />}
            {lastPhase && <PhaseFinalResult game={game} playerKey={playerKey} />}
          </div>
        );
      default:
        return (null);
    }
  }
}
Minigame.propTypes = {
  game: PropTypes.object.isRequired,
  createPlayer: PropTypes.func.isRequired,
  playerKey: PropTypes.string.isRequired,
};
export default Minigame;
