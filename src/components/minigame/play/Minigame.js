import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PhaseConnection from './PhaseConnection';
import PhaseStarting from './PhaseStarting';
import PhaseFinalResult from './PhaseFinalResult';
import SnakeController from '../snake/SnakeController';
import TetrisController from '../tetris/TetrisController';
import GolfController from '../golf/GolfController';
import SpotifyConnection from '../spotify/play/SpotifyConnection';
import SpotifyController from '../spotify/play/SpotifyController';
import SpotifyResultQuestion from '../spotify/play/SpotifyResultQuestion';
import {
  SPOTIFY_GREEN,
  SPOTIFY_WHITE,
} from '../spotify/SpotifyConstants';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: SPOTIFY_GREEN,
    },
    secondary: {
      main: SPOTIFY_WHITE,
    },
  },
  overrides: {
    MuiButton: { // Name of the component ⚛️ / style sheet
      root: { // Name of the rule
        borderRadius: 500,
        padding: '11px 44px',
        color: SPOTIFY_WHITE,
        letterSpacing: '.16em',
        WebkitTransition: 'none 33ms cubic-bezier(.3,0,.7,1)',
        transition: 'none 33ms cubic-bezier(.3,0,.7,1)',
        WebkitTransitionProperty: 'all',
        transitionProperty: 'all',
        touchAction: 'manipulation',
        willChange: 'transform',
        lineHeight: 1.6,
        minWidth: 130,
        margin: 10,
        fontWeight: 300,
        fontSize: 11,
        '&:hover': {
          WebkitTransition: 'none 33ms cubic-bezier(.3,0,0,1)',
          transition: 'none 33ms cubic-bezier(.3,0,0,1)',
          WebkitTransitionProperty: 'all',
          transitionProperty: 'all',
          WebkitTransform: 'scale(1.06)',
          transform: 'scale(1.06)',
        },
      },
      textPrimary: {
        backgroundColor: SPOTIFY_GREEN,
        color: SPOTIFY_WHITE,
        '&:hover': {
          backgroundColor: '#1ed760',
        },
      },
      textSecondary: {
        backgroundColor: 'rgba(24,24,24,.7)',
        '&:hover': {
          backgroundColor: 'rgba(24,24,24,.7)',
          webkitBoxShadow: 'inset 0 0 0 2px #fff, 0 0 0 1px rgba(0,0,0,0)',
          boxShadow: 'inset 0 0 0 2px #fff, 0 0 0 1px rgba(0,0,0,0)',
        },
        webkitBoxShadow: 'inset 0 0 0 2px #b3b3b3',
        boxShadow: 'inset 0 0 0 2px #b3b3b3',
      },
    },
  },
});
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
        document.querySelector('body').classList.add('dark-mode');
        return (
          <MuiThemeProvider theme={theme}>
            <div className="play-container">
              {game.phase === 'connection' && <SpotifyConnection game={game} addPlayer={createPlayer} playerKey={playerKey} />}
              {game.phase === 'gameplay' && <SpotifyController game={game} playerKey={playerKey} />}
              {game.phase === 'level_completed' && <SpotifyResultQuestion game={game} playerKey={playerKey} />}
              {lastPhase && <PhaseFinalResult game={game} playerKey={playerKey} />}
            </div>
          </MuiThemeProvider>
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
