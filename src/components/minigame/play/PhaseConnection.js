import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';

function generateName(currentNames) {
  const adjectives = ['rutig,', 'antik', 'arg', 'lugn', 'friterad', 'hemlig', 'lycklig', 'gammal', 'rutten', 'smidig', 'vegansk', 'stark', 'full', 'giftig', 'djurig', 'artig', 'smutsig', 'dum', 'smart', 'stilig', 'snabb', 'långsam', 'seg', 'blygsam', 'envis', 'cool', 'tuff', 'spännande', 'farlig'];
  const nouns = ['ninja', 'stol', 'pankaka', 'staty', 'enhörning', 'regnbåge', 'kanin', 'kapten', 'cupcake', 'morot', 'potatis', 'salad', 'gardin', 'toalett', 'streckgubbe', 'drake', 'farmor', 'mormor', 'farfar', 'morfar', 'mellanchef', 'rörmokare', 'bilförsäljare', 'skogshuggare', 'pensionär', 'cirkus', 'studdsmatta', 'clown', 'mellanchef', 'busschafför', 'luftballong', 'boss', 'tiger'];
  let finalName = '';
  for (let i = 0; i < 20; i++) {
    let name = '';
    if (i > 10) {
      name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    } else {
      name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    }
    if (currentNames.indexOf(name) > -1) {
      continue;
    } else {
      finalName = name;
      break;
    }
  }
  return finalName;
}
class PhaseConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
    this.createPlayer = this.createPlayer.bind(this);
  }

  componentDidMount() {
    const { playerKey, game, addPlayer } = this.props;
    if (!playerKey && game.minigame.nameGenerator) {
      addPlayer(this.generatePlayer());
    }
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  createPlayer() {
    const { name } = this.state;
    const { addPlayer } = this.props;
    // validera så att namnet inte är taget.
    const player = {
      name,
      score: 0,
    };
    addPlayer(player);
  }

  generatePlayer() {
    const { game } = this.props;
    let currentNames = [];
    if (game.players) {
      currentNames = Object.values(game.players).map(a => a.name);
    }
    const name = generateName(currentNames);
    const player = {
      name,
      score: 0,
    };
    return player;
  }


  render() {
    const { game, playerKey } = this.props;
    const { name } = this.state;
    let playerName = '';
    if (game.players && playerKey && game.players[playerKey]) {
      playerName = game.players[playerKey].name;
    }
    return (
      <div className="phase-container">
        {playerName
          ? (
            <div>
              <div className="quiz-top-section" />
              <div className="quiz-middle-section">
                <Typography variant="h5">
                  <span>Welcome </span>
                  <span className="dynamic-text">{playerName}</span>
                </Typography>
                <Typography variant="subtitle1"> Watch the screen, your name should show.</Typography>
              </div>
              <div className="quiz-bottom-section" />
            </div>
          )
          : (
            <div>
              <FormControl>
                <TextField
                  label="Name"
                  name="name"
                  value={name}
                  margin="normal"
                  onChange={this.handleChange('name')}
                />
              </FormControl>
              <Button onClick={this.createPlayer} variant="contained">done</Button>
            </div>
          )
            }
      </div>
    );
  }
}
PhaseConnection.propTypes = {
  game: PropTypes.object.isRequired,
  playerKey: PropTypes.string,
  addPlayer: PropTypes.func.isRequired,
};
export default PhaseConnection;
