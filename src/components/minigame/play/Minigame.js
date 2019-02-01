import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import PhaseFinalResult from './PhaseFinalResult';
import SnakeController from '../snake/SnakeController';
import TetrisController from '../tetris/TetrisController';
import GolfController from '../golf/GolfController';
import SpotifyConnection from '../spotify/play/SpotifyConnection';
import SpotifyController from '../spotify/play/SpotifyController';
import SpotifyResultQuestion from '../spotify/play/SpotifyResultQuestion';

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
      case 'spotify':
        return (
          <div className="play-container">
            {game.phase === 'connection' && <SpotifyConnection game={game} addPlayer={createPlayer} playerKey={playerKey} />}
            {game.phase === 'starting' && <PhaseStarting game={game} />}
            {game.phase === 'gameplay' && <SpotifyController game={game} playerKey={playerKey} />}
            {game.phase === 'level_completed' && <SpotifyResultQuestion game={game} playerKey={playerKey} />}
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
