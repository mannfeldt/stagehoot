import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class CreateTetris extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      gametype: 'tetris',
      gamemode: 'survival',
      password: '',
    };

    this.validateGame = this.validateGame.bind(this);
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
        password, gametype, title, gamemode,
      } = this.state;
      const minigame = {
        gamemode,
      };
      const game = {
        password,
        gametype,
        title,
        minigame,
      };
      createGame(game);
    }

    render() {
      const {
        password, title, gamemode,
      } = this.state;
      return (
        <div className="app-page create-page">
          <Grid container spacing={8}>
            <form autoComplete="off">
              <Grid item xs={4}>
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

                <Button onClick={this.createGame} variant="contained">Create</Button>
              </Grid>
            </form>

          </Grid>
        </div>
      );
    }
}
CreateTetris.propTypes = {
  createGame: PropTypes.func.isRequired,
};
export default CreateTetris;
