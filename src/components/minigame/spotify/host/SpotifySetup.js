import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import {
  AUTH_EXPIRE_MS,
  CLIENT_ID,
} from '../SpotifyConstants';

class SpotifySetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyPlayers: false,
      questions: 16,
      nameGenerator: false,
      gamemode: props.game.minigame.gamemode,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('spotifytoken');
    const timestamp = localStorage.getItem('spotifytoken_timestamp');

    // If there is no token, redirect to Spotify authorization. kolla om token gått ut också
    // jag kan sätta redirect till någon anna route och lösa det så att när man kommer dit så går den direkt och kollar i firebase och connectar än till rätt game?

    if (!token || Date.now() - timestamp > AUTH_EXPIRE_MS) {
      const authEndpoint = 'https://accounts.spotify.com/authorize';
      // Replace with your app's client ID, redirect URI and desired scopes
      const redirectUri = window.location.origin + window.location.pathname;
      const scopes = [
        'user-top-read',
      ];
      window.location = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
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
        questions, gamemode,
      } = this.state;
      const minigame = {
        surveyPlayers,
        nameGenerator,
        multiplayerMode,
        gamemode,
        questions,
        currentq: 0,
      };
      game.minigame = minigame;
      game.phase = 'connection';
      game.status = 'IN_PROGRESS';
      gameFunc.update(game);
    };

    render() {
      const {
        nameGenerator,
        gamemode,
        questions,
      } = this.state;
      return (
        <div className="phase-container">
          <Typography variant="h4">Game Settings</Typography>
          <Button onClick={() => this.startGame('classic')} variant="contained">Classic</Button>
          <Button onClick={() => this.startGame('coop')} variant="contained">Co-op multiplayer</Button>
          <Button onClick={() => this.startGame('team')} variant="contained">Team multiplayer</Button>
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

              <FormControl required>
                <InputLabel htmlFor="gametype-required">Game mode</InputLabel>
                <Select
                  value={gamemode || ''}
                  onChange={this.handleChangeSelect}
                  name="gamemode"
                  inputProps={{
                    id: 'gamemode-required',
                  }}
                >
                  <MenuItem value="classic">Classic</MenuItem>
                  <MenuItem value="wild">Wild</MenuItem>

                </Select>
              </FormControl>
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
