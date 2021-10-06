import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Typography } from "@material-ui/core";

class CreateGolfRace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      gametype: "golfrace",
      password: "",
    };

    this.createGame = this.createGame.bind(this);
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeBool = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createGame() {
    const { createGame } = this.props;
    const { password, gametype, title } = this.state;
    const minigame = {};
    const game = {
      password,
      gametype,
      title,
      minigame,
    };
    createGame(game);
  }

  render() {
    const { password, title } = this.state;
    return (
      <div className="app-page create-page">
        <Grid container spacing={24}>
          <form autoComplete="off">
            <Grid item xs={12}>
              <Typography variant="h4">New Golf Race</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <TextField
                  label="Title"
                  name="title"
                  value={title}
                  margin="normal"
                  onChange={this.handleChange("title")}
                />
              </FormControl>
              <FormControl>
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  margin="normal"
                  value={password}
                  onChange={this.handleChange("password")}
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
CreateGolfRace.propTypes = {
  createGame: PropTypes.func.isRequired,
};
export default CreateGolfRace;
