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

class SnakeSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyPlayers: false,
      nameGenerator: false,
      gamemode: props.game.minigame.gamemode,
      racetarget: props.game.minigame.racetarget,
      opponentCollision: props.game.minigame.opponentCollision,
      eatOpponents: props.game.minigame.eatOpponents,
      wallCollision: props.game.minigame.wallCollision,
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
        surveyPlayers, nameGenerator, wallCollision,
        opponentCollision, eatOpponents, racetarget, difficulty, gamemode,
      } = this.state;
      const minigame = {
        surveyPlayers,
        nameGenerator,
        multiplayerMode,
        wallCollision,
        opponentCollision,
        eatOpponents,
        racetarget,
        difficulty,
        gamemode,
      };
      game.minigame = minigame;
      game.phase = 'connection';
      game.status = 'IN_PROGRESS';
      gameFunc.update(game);
    };

    render() {
      const {
        surveyPlayers, nameGenerator, wallCollision,
        opponentCollision, eatOpponents, racetarget, difficulty, gamemode,
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
                  <MenuItem value="survival">Survival</MenuItem>
                  <MenuItem value="race">Race</MenuItem>

                </Select>
              </FormControl>

              {gamemode === 'race'
                            && (
                            <FormControl>
                              <TextField
                                label="Snake length"
                                name="racetarget"
                                type="number"
                                value={racetarget}
                                margin="normal"
                                onChange={this.handleChange('racetarget')}
                              />
                            </FormControl>
                            )
                        }
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
                      checked={wallCollision}
                      onChange={this.handleChangeBool('wallCollision')}
                      value="wallCollision"
                    />
                )}
                  label="Wall collisions"
                />
              </FormControl>

              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Switch
                      checked={opponentCollision}
                      onChange={this.handleChangeBool('opponentCollision')}
                      value="opponentCollision"
                    />
                )}
                  label="Opponent collisions"
                />
              </FormControl>
              <FormControl component="fieldset">
                <FormControlLabel
                  control={(
                    <Switch
                      checked={opponentCollision && eatOpponents}
                      disabled={!opponentCollision}
                      onChange={this.handleChangeBool('eatOpponents')}
                      value="eatOpponents"
                    />
                )}
                  label="Eat opponent on collision"
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
SnakeSetup.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default SnakeSetup;
