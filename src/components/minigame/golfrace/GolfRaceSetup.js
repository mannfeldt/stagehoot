import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";

class GolfRaceSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameGenerator: true,
    };
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

  startGame = (multiplayerMode) => {
    const { game, gameFunc } = this.props;
    const { nameGenerator } = this.state;
    const minigame = {
      nameGenerator,
    };
    game.minigame = minigame;
    game.phase = "connection";
    game.status = "IN_PROGRESS";
    gameFunc.update(game);
  };

  render() {
    const { nameGenerator } = this.state;
    return (
      <div className="phase-container">
        <Typography variant="h4">Game Settings</Typography>
        <Button onClick={() => this.startGame("classic")} variant="contained">
          Start
        </Button>
        <FormControl component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={nameGenerator}
                  onChange={this.handleChangeBool("nameGenerator")}
                  value="nameGenerator"
                />
              }
              label="Generate names for players"
            />
          </FormGroup>
        </FormControl>
      </div>
    );
  }
}
GolfRaceSetup.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default GolfRaceSetup;
