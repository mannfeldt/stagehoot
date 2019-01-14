import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PhaseSetup from './PhaseSetup';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import Snake from '../snake/Snake';
import Tetris from '../tetris/Tetris';
import PhaseFinalResult from './PhaseFinalResult';
import PhaseEnd from './PhaseEnd';
import SnakeStarting from '../snake/SnakeStarting';
import Golf from '../golf/Golf';
import GolfStarting from '../golf/GolfStarting';
import SnakeSetup from '../snake/SnakeSetup';
import GolfSetup from '../golf/GolfSetup';
import GolfLevelCompleted from '../golf/GolfLevelCompleted';

class Minigame extends PureComponent {
  render() {
    const { game, gameFunc } = this.props;
    switch (game.gametype) {
      case 'snake':
        return (
          <div className="host-container">
            {game.phase === 'setup' && <SnakeSetup game={game} gameFunc={gameFunc} />}
            {game.phase === 'connection' && <PhaseConnection game={game} gameFunc={gameFunc} />}
            {game.phase === 'starting' && <SnakeStarting game={game} gameFunc={gameFunc} />}
            {game.phase === 'gameplay' && <Snake game={game} gameFunc={gameFunc} />}
            {game.phase === 'final_result' && <PhaseFinalResult game={game} gameFunc={gameFunc} />}
            {game.phase === 'end' && <PhaseEnd game={game} gameFunc={gameFunc} />}
          </div>
        );
      case 'tetris':
        return (
          <div className="host-container">
            {game.phase === 'setup' && <PhaseSetup game={game} gameFunc={gameFunc} />}
            {game.phase === 'connection' && <PhaseConnection game={game} gameFunc={gameFunc} />}
            {game.phase === 'starting' && <PhaseStarting game={game} gameFunc={gameFunc} />}
            {game.phase === 'gameplay' && <Tetris game={game} gameFunc={gameFunc} />}
            {game.phase === 'final_result' && <PhaseFinalResult game={game} gameFunc={gameFunc} />}
            {game.phase === 'end' && <PhaseEnd game={game} gameFunc={gameFunc} />}
          </div>
        );
      case 'golf':
        return (
          <div className="host-container">
            {game.phase === 'setup' && <GolfSetup game={game} gameFunc={gameFunc} />}
            {game.phase === 'connection' && <PhaseConnection game={game} gameFunc={gameFunc} />}
            {game.phase === 'starting' && <GolfStarting game={game} gameFunc={gameFunc} />}
            {(game.phase === 'gameplay' || game.phase === 'level_completed') && <Golf game={game} gameFunc={gameFunc} />}
            {game.phase === 'final_result' && <PhaseFinalResult game={game} gameFunc={gameFunc} />}
            {game.phase === 'end' && <PhaseEnd game={game} gameFunc={gameFunc} />}
          </div>
        );
      default:
        return (null);
    }
  }
}
Minigame.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default Minigame;
