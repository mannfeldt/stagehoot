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

class GolfSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyPlayers: false,
      nameGenerator: false,
      gamemode: props.game.minigame.gamemode,
      holes: props.game.minigame.holes,
      scoremode: props.game.minigame.scoremode,
      speedmode: props.game.minigame.speedmode,
      difficulty: props.game.minigame.difficulty,
    };
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
        holes, difficulty, gamemode, scoremode, speedmode,
      } = this.state;
      const minigame = {
        surveyPlayers,
        nameGenerator,
        speedmode,
        multiplayerMode,
        holes,
        difficulty,
        gamemode,
        scoremode,
      };
      game.minigame = minigame;
      game.phase = 'connection';
      game.status = 'IN_PROGRESS';
      gameFunc.update(game);
    };

    render() {
      const {
        surveyPlayers, nameGenerator,
        holes, difficulty, gamemode, scoremode, speedmode,
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

              {gamemode === 'classic'
                            && (
                            <FormControl>
                              <TextField
                                label="holes to play"
                                name="holes"
                                type="number"
                                value={holes}
                                margin="normal"
                                onChange={this.handleChange('holes')}
                              />
                            </FormControl>
                            )
                        }
              <FormControl required>
                <InputLabel htmlFor="scoremode-required">Score mode</InputLabel>
                <Select
                  value={scoremode || ''}
                  onChange={this.handleChangeSelect}
                  name="scoremode"
                  inputProps={{
                    id: 'scoremode-required',
                  }}
                >
                  <MenuItem value="strokes">Strokes</MenuItem>
                  <MenuItem value="time">Time</MenuItem>
                  <MenuItem value="compedetive">Compedetive</MenuItem>


                </Select>
              </FormControl>
              <FormControl required>
                <InputLabel htmlFor="gametype-required">difficulty</InputLabel>
                <Select
                  value={difficulty || ''}
                  onChange={this.handleChangeSelect}
                  name="difficulty"
                  inputProps={{
                    id: 'difficulty-required',
                  }}
                >
                  <MenuItem value="500">Easy</MenuItem>
                  <MenuItem value="300">Medium</MenuItem>
                  <MenuItem value="100">Hard</MenuItem>
                  <MenuItem value="75">Pro</MenuItem>
                </Select>
              </FormControl>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Switch
                      checked={speedmode}
                      onChange={this.handleChangeBool('speedmode')}
                      value="speedmode"
                    />
                )}
                  label="Speed mode"
                />
              </FormControl>
              <FormControlLabel
                control={(
                  <Switch
                    checked={surveyPlayers}
                    onChange={this.handleChangeBool('surveyPlayers')}
                    value="surveyPlayers"
                  />
                )}
                label="Survey players after game"
              />
            </FormGroup>
          </FormControl>
        </div>
      );
    }
}
GolfSetup.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default GolfSetup;
