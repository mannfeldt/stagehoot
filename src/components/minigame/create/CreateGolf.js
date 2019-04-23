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

class CreateGolf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      gametype: 'golf',
      holes: 18,
      scoremode: 'strokes',
      speedmode: true,
      opponentCollision: false,
      password: '',
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
      password,
      gametype,
      title,
      holes,
      scoremode,
      speedmode,
    } = this.state;
    const minigame = {
      scoremode,
      speedmode,
      holes,
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
      password,
      title,
      holes,
      scoremode,
      speedmode,
    } = this.state;
    return (
      <div className="app-page create-page">
        <Grid container spacing={24}>
          <form autoComplete="off">
            <Grid item xs={12}>
              <Typography variant="h4">New Golf game</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <InputLabel htmlFor="scoremode-required">Score mode</InputLabel>
                <Select
                  value={scoremode || ''}
                  fullWidth
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
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  label="Holes to play"
                  name="holes"
                  type="number"
                  value={holes}
                  margin="normal"
                  onChange={this.handleChange('holes')}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
              <Button onClick={this.createGame} variant="contained">


                Create
                            </Button>
            </Grid>
          </form>
        </Grid>
      </div>
    );
  }
}
CreateGolf.propTypes = {
  createGame: PropTypes.func.isRequired,
};
export default CreateGolf;
