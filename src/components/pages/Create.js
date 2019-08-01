import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography, Card } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CreateQuiz from '../quiz/create/CreateQuiz';
import { fire, fireGolf } from '../../base';
import CreateMinigame from '../minigame/create/CreateMinigame';
import { generateGameId } from '../common/utils/appUtil';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gametype: '',
      gameId: '',
    };
    this.createGame = this.createGame.bind(this);
    // this.validateGame = this.validateGame.bind(this);
  }

    setGameType = name => () => {
      this.setState({ gametype: name });
    };

    createGame(g) {
      const { gametype } = this.state;
      const game = g;
      game.gameId = generateGameId();
      game.created = Date.now();
      game.status = 'CREATED';
      game.phase = 'setup';

      const that = this;
      // game push få ett id.
      let gameRef;
      if (game.gametype === 'golf') {
        gameRef = fireGolf.database().ref('/games').push();
      } else {
        gameRef = fire.database().ref('/games').push();
      }
      game.key = gameRef.key;
      gameRef.set(game, (error) => {
        if (error) {
          that.setState({
            errorText: `Error: ${error}`,
          });
          const snack = {
            variant: 'error',
            message: 'Unexpected internal error',
          };
          that.props.showSnackbar(snack);
        } else {
          const snack = {
            variant: 'success',
            message: 'Successfully created!',
          };
          that.props.showSnackbar(snack);
          that.setState({
            gameId: game.gameId,
            gametype: 'done',
          });
          localStorage.setItem('RecentGameId', game.gameId);

          // show gameid and password
          // show button to start game / navigate to host
        }
      });
    }

    render() {
      const { gametype, gameId } = this.state;
      const { showSnackbar } = this.props;
      return (
        <div className="app-page create-page">
          {!gametype && (
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('quiz')}>
                <CardHeader title="Quiz" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Create your own quiz or generate one fast and easy</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('minigame')}>
                <CardHeader title="Mini Game" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Create a game to play just for fun or team building purposes</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('survey')}>
                <CardHeader title="Survey" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Survey your audience</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="card-button" onClick={this.setGameType('discussion')}>
                <CardHeader title="Discussion" />
                <CardContent>
                  <Typography variant="subtitle1" align="center">Create a discussion on a sppecified topic</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          )}
          {gametype === 'quiz' && <CreateQuiz createQuiz={this.createGame} showSnackbar={showSnackbar} />}
          {gametype === 'minigame' && <CreateMinigame createGame={this.createGame} showSnackbar={showSnackbar} />}
          {gametype === 'done'
                    && (
                    <div>
                      <Typography variant="h2">
                        <span>Created game PIN: </span>
                        {' '}
                        <span className="dynamic-text">{gameId}</span>
                      </Typography>
                      <Link to="/host">Host game</Link>
                    </div>
                    )
                }
        </div>
      );
    }
}
Create.propTypes = {
  showSnackbar: PropTypes.func.isRequired,
};
export default Create;
