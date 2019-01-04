import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import { fire } from '../../base';
import Quiz from '../quiz/play/Quiz';
import Minigame from '../minigame/play/Minigame';

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {},
      gameId: '',
      playerKey: '',
    };
    this.createPlayer = this.createPlayer.bind(this);
    this.fetchGame = this.fetchGame.bind(this);
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  fetchGame() {
    const { gameId } = this.state;
    const { showSnackbar, toggleHeader } = this.props;
    const that = this;
    fire.database().ref('games').orderByChild('gameId').equalTo(gameId)
      .once('value', (snapshot) => {
        if (snapshot.val()) {
          let game;
          snapshot.forEach((child) => {
            game = child.val();
          });
          // får skapa en ny attribut, canPlayerJoin true/false om det begövs
          if (game.phase === 'connection') {
            const storedPlayerKey = localStorage.getItem('RecentPlayerKey');
            if (storedPlayerKey && game.players && game.players[storedPlayerKey]) {
              that.setState({ playerKey: storedPlayerKey });
            }

            that.initGameListiner(game.key);
            const snack = {
              variant: 'success',
              message: 'Connected to game',
            };
            showSnackbar(snack);
            toggleHeader(false);
          } else if (game.phase === 'setup') {
            const snack = {
              variant: 'error',
              message: 'Game is not yet started',
            };
            showSnackbar(snack);
          } else {
            const storedPlayerKey = localStorage.getItem('RecentPlayerKey');
            if (storedPlayerKey && game.players && game.players[storedPlayerKey]) {
              that.setState({ playerKey: storedPlayerKey });
              that.initGameListiner(game.key);
              const snack = {
                variant: 'success',
                message: 'Connected to game',
              };
              showSnackbar(snack);
              toggleHeader(false);
            } else {
              const snack = {
                variant: 'error',
                message: 'Game is in progress',
              };
              showSnackbar(snack);
            }
          }
        } else {
          const snack = {
            variant: 'info',
            message: 'No game found',
          };
          showSnackbar(snack);
        }
      });
  }

  initGameListiner(gameKey) {
    const gameRef = fire.database().ref(`games/${gameKey}`);
    const that = this;
    gameRef.on('value', (snapshot) => {
      const game = snapshot.val();
      if (game) {
        // kan blir problem med asynch setstate?
        that.setState({
          game,
        });
      } else {
        that.setState({
          game: '',
        });
      }
    });
  }

  createPlayer(player) {
    const { game } = this.state;
    const { showSnackbar } = this.props;
    const playerRef = fire.database().ref(`/games/${game.key}/players`).push();
    const newPlayer = Object.assign({ key: playerRef.key }, player);
    const that = this;
    playerRef.set(newPlayer, (error) => {
      if (error) {
        const snack = {
          variant: 'error',
          message: 'Unexpected internal error',
        };
        showSnackbar(snack);
      } else {
        that.setState({
          playerKey: newPlayer.key,
        });
        localStorage.setItem('RecentPlayerKey', newPlayer.key);
      }
    });
  }

  render() {
    const { game, playerKey, gameId } = this.state;
    const { showSnackbar } = this.props;
    if (!game.phase) {
      return (
        <div className="page-container play-page">
          <FormControl>
            <TextField
              label="Game PIN"
              name="Game ID"
              value={gameId}
              margin="normal"
              onChange={this.handleChange('gameId')}
            />
          </FormControl>
          <Button onClick={this.fetchGame} variant="contained">Join</Button>
        </div>
      );
    }
    return (
      <div className="page-container play-page">
        {game.gametype === 'quiz' && <Quiz game={game} createPlayer={this.createPlayer} playerKey={playerKey} showSnackbar={showSnackbar} />}
        {game.gametype === 'snake' && <Minigame game={game} createPlayer={this.createPlayer} playerKey={playerKey} showSnackbar={showSnackbar} />}
        {game.gametype === 'tetris' && <Minigame game={game} createPlayer={this.createPlayer} playerKey={playerKey} showSnackbar={showSnackbar} />}
        {game.gametype === 'golf' && <Minigame game={game} createPlayer={this.createPlayer} playerKey={playerKey} showSnackbar={showSnackbar} />}

      </div>
    );
  }
}
Play.propTypes = {
  showSnackbar: PropTypes.func.isRequired,
  toggleHeader: PropTypes.func.isRequired,
};
export default Play;
