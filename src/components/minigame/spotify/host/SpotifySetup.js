import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import {
  AUTH_EXPIRE_MS,
  CLIENT_ID,
  SPOTIFY_AUTH_SCOPES,
} from '../SpotifyConstants';

class SpotifySetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyPlayers: false,
      questions: props.game.minigame.questions,
      nameGenerator: false,
      autoplay: props.game.minigame.autoplay,
      invalidSpotifyToken: !localStorage.getItem('spotifytoken') || Date.now() - localStorage.getItem('spotifytoken_timestamp') > AUTH_EXPIRE_MS,
    };
  }

  componentDidMount() {
    const { invalidSpotifyToken } = this.state;
    const token = localStorage.getItem('spotifytoken');

    // If there is no token, redirect to Spotify authorization. kolla om token gått ut också
    // jag kan sätta redirect till någon anna route och lösa det så att när man kommer dit så går den direkt och kollar i firebase och connectar än till rätt game?

    if (invalidSpotifyToken) {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      // Replace with your app's client ID, redirect URI and desired scopes
      const redirectUri = window.location.origin + window.location.pathname;
      localStorage.setItem('spotify_type', 'host');
      window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SPOTIFY_AUTH_SCOPES.join('%20')}&response_type=token&show_dialog=true`;
    }
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
  }

    handleChange = name => (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };

    handleChangeBool = name => (event) => {
      this.setState({ [name]: event.target.checked });
    };

    handleChangeSelect = (event) => {
      this.setState({ [event.target.name]: event.target.value });
    };

    startGame = (multiplayerMode) => {
      const { game, gameFunc } = this.props;
      const {
        surveyPlayers, nameGenerator,
        questions, autoplay,
      } = this.state;
      game.minigame.surveyPlayers = surveyPlayers;
      game.minigame.nameGenerator = nameGenerator;
      game.minigame.multiplayerMode = multiplayerMode;
      game.minigame.autoplay = autoplay;
      game.minigame.questions = questions;
      game.minigame.currentq = 0;
      game.phase = 'connection';
      game.status = 'IN_PROGRESS';
      gameFunc.update(game);
    };

    render() {
      const {
        nameGenerator,
        questions,
        invalidSpotifyToken,
        autoplay,
      } = this.state;
      if (invalidSpotifyToken) {
        return (
          <span>Loading...</span>
        );
      }
      return (
        <div className="phase-container">
          <Typography variant="h4">Game Settings</Typography>
          <Button onClick={() => this.startGame('classic')} color="primary">Start</Button>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={(
                  <Switch
                    checked={nameGenerator}
                    onChange={this.handleChangeBool('nameGenerator')}
                    value="nameGenerator"
                  />
                )}
                label="Generate names for players"
              />
              <FormControlLabel
                control={(
                  <Switch
                    checked={autoplay}
                    onChange={this.handleChangeBool('autoplay')}
                    value="autoplay"
                  />
                )}
                label="Autoplay questions"
              />
              <FormControl>
                <TextField
                  label="Questions to play"
                  name="questions"
                  type="number"
                  value={questions}
                  margin="normal"
                  onChange={this.handleChange('questions')}
                />
              </FormControl>
            </FormGroup>
          </FormControl>
        </div>
      );
    }
}
SpotifySetup.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default SpotifySetup;
