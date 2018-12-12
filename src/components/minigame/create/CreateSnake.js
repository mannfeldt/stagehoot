import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Typography } from '@material-ui/core';

class CreateSnake extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      gametype: 'snake',
      gamemode: 'survival',
      racetarget: 20,
      opponentCollision: false,
      eatOpponents: false,
      wallCollision: true,
      password: '',
      difficulty: '300',
    };

    this.createGame = this.createGame.bind(this);
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

    createGame() {
      const { createGame } = this.props;
      const {
        password, gametype, title, gamemode, wallCollision,
        opponentCollision, eatOpponents, racetarget, difficulty,
      } = this.state;
      const minigame = {
        gamemode,
        wallCollision,
        eatOpponents,
        opponentCollision,
        racetarget,
        difficulty,
      };
      const game = {
        password,
        gametype,
        title,
        minigame,
      };
      createGame(game);
    }

    /*
    validateGame(game) {
      // validera lösenord är tillräckligt starkt här
      //eller direkt efter input om det finns någon smart lösning.
      // kolla på gametype hur ha en secifik validering för varje type
      return true;
    }

    clearForm() {

    }
*/
    render() {
      const {
        password, title, gamemode, wallCollision,
        opponentCollision, eatOpponents, racetarget, difficulty,
      } = this.state;
      return (
        <div className="app-page create-page">
          <Grid container spacing={24}>
            <form autoComplete="off">
              <Grid item xs={12}>
                <Typography variant="h4">New Snake game</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth>
                  <InputLabel htmlFor="gametype-required">Game mode</InputLabel>
                  <Select
                    value={gamemode || ''}
                    fullWidth
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
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth>
                  <InputLabel htmlFor="gametype-required">difficulty</InputLabel>
                  <Select
                    value={difficulty || ''}
                    fullWidth
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
              </Grid>
              <Grid item xs={12}>

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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <TextField
                    label="Title"
                    name="title"
                    value={title}
                    margin="normal"
                    onChange={this.handleChange('title')}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    margin="normal"
                    value={password}
                    onChange={this.handleChange('password')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={this.createGame} variant="contained">Create</Button>
              </Grid>
            </form>

          </Grid>
        </div>
      );
    }
}
CreateSnake.propTypes = {
  createGame: PropTypes.func.isRequired,
};
export default CreateSnake;
