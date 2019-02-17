import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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
import SpotifySetup from '../spotify/host/SpotifySetup';
import SpotifyConnection from '../spotify/host/SpotifyConnection';
import SpotifyStarting from '../spotify/host/SpotifyStarting';
import Spotify from '../spotify/host/Spotify';
import {
  SPOTIFY_WHITE,
  SPOTIFY_GREEN,
} from '../spotify/SpotifyConstants';
// kan jag lägga till primary och secondary färger? ersätter blå/pink?
// eller jag får styla det nu. det är bara UI-componenterna som är formade för en mörk bakgrund nu.
// fixa en generell spotify.css? i den har jag bara generella saker som är för alla compoenneter. typ body.backgorundcolor = darkgray, typgrahy color inte helt vit?
// kan jag lägga in saker i theme här? typ att inte använda ren vit till text #fff
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
      case 'spotify':
        document.querySelector('body').classList.add('dark-mode');
        return (
          <MuiThemeProvider theme={theme}>
            <div className="host-container">
              {game.phase === 'setup' && <SpotifySetup game={game} gameFunc={gameFunc} />}
              {game.phase === 'connection' && <SpotifyConnection game={game} gameFunc={gameFunc} />}
              {(game.phase === 'gameplay' || game.phase === 'level_completed') && <Spotify game={game} gameFunc={gameFunc} />}
              {game.phase === 'final_result' && <PhaseFinalResult game={game} gameFunc={gameFunc} />}
              {game.phase === 'end' && <PhaseEnd game={game} gameFunc={gameFunc} />}
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
  gameFunc: PropTypes.object.isRequired,
};
export default Minigame;
