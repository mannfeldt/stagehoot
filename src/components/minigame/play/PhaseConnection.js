import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';

function generateName(currentNames) {
  const adjectives = ['adamant', 'adroit', 'amatory', 'animistic', 'antic', 'arcadian', 'baleful', 'bellicose', 'bilious', 'boorish', 'calamitous', 'caustic', 'cerulean', 'comely', 'concomitant', 'contumacious', 'corpulent', 'crapulous', 'defamatory', 'didactic', 'dilatory', 'dowdy', 'efficacious', 'effulgent', 'egregious', 'endemic', 'equanimous', 'execrable', 'fastidious', 'feckless', 'fecund', 'friable', 'fulsome', 'garrulous', 'guileless', 'gustatory', 'heuristic', 'histrionic', 'hubristic', 'incendiary', 'insidious', 'insolent', 'intransigent', 'inveterate', 'invidious', 'irksome', 'jejune', 'jocular', 'judicious', 'lachrymose', 'limpid', 'loquacious', 'luminous', 'mannered', 'mendacious', 'meretricious', 'minatory', 'mordant', 'munificent', 'nefarious', 'noxious', 'obtuse', 'parsimonious', 'pendulous', 'pernicious', 'pervasive', 'petulant', 'platitudinous', 'precipitate', 'propitious', 'puckish', 'querulous', 'quiescent', 'rebarbative', 'recalcitant', 'redolent', 'rhadamanthine', 'risible', 'ruminative', 'sagacious', 'salubrious', 'sartorial', 'sclerotic', 'serpentine', 'spasmodic', 'strident', 'taciturn', 'tenacious', 'tremulous', 'trenchant', 'turbulent', 'turgid', 'ubiquitous', 'uxorious', 'verdant', 'voluble', 'voracious', 'wheedling', 'withering', 'zealous'];
  const nouns = ['ninja', 'chair', 'pancake', 'statue', 'unicorn', 'rainbows', 'laser', 'senor', 'bunny', 'captain', 'nibblets', 'cupcake', 'carrot', 'gnomes', 'glitter', 'potato', 'salad', 'toejam', 'curtains', 'beets', 'toilet', 'exorcism', 'stick figures', 'mermaid eggs', 'sea barnacles', 'dragons', 'jellybeans', 'snakes', 'dolls', 'bushes', 'cookies', 'apples', 'ice cream', 'ukulele', 'kazoo', 'banjo', 'opera singer', 'circus', 'trampoline', 'carousel', 'carnival', 'locomotive', 'hot air balloon', 'praying mantis', 'animator', 'artisan', 'artist', 'colorist', 'inker', 'coppersmith', 'director', 'designer', 'flatter', 'stylist', 'leadman', 'limner', 'make-up artist', 'model', 'musician', 'penciller', 'producer', 'scenographer', 'set decorator', 'silversmith', 'teacher', 'auto mechanic', 'beader', 'bobbin boy', 'clerk of the chapel', 'filling station attendant', 'foreman', 'maintenance engineering', 'mechanic', 'miller', 'moldmaker', 'panel beater', 'patternmaker', 'plant operator', 'plumber', 'sawfiler', 'shop foreman', 'soaper', 'stationary engineer', 'wheelwright', 'woodworkers'];
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
                  <span>Welcome</span>
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
