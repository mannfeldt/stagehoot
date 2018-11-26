import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import CountdownAnimation from '../../common/CountdownAnimation';

function chunkify(a, nr) {
  let n = nr;
  if (n < 2) { return [a]; }
  const len = a.length;
  const out = [];
  let i = 0;
  let size;
  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  } else {
    while (i < len) {
      size = Math.ceil((len - i) / n);
      n -= 1;
      out.push(a.slice(i, i += size));
    }
  }
  return out;
}
function createSnakes(players) {
  const playerKeys = Object.keys(players);
  const snakes = [];
  // mocka flera spelare genom att loopa på x och sen byt player.key till playerKeys[0]
  for (let i = 0; i < playerKeys.length; i++) {
    const player = players[playerKeys[i]];
    const snake = {
      playerKeys: [player.key],
      actions: ['up', 'down', 'right', 'left'],
      score: 0,
      color: SNAKE_COLORS[i % SNAKE_COLORS.length],
      name: SNAKE_NAMES[i % SNAKE_NAMES.length],
      // start positioner ska randomas helt, inklusive direction, varanan ska starta nereifrån upp, uppifrån ner, höger till vänster, vänster till göger..
      // fyra olika random metoder och y måste vara unikt för de som kör horizontelt och x måste vara unikt för som kör vertikalt, kanske även ett mellanrum mellan varje snake
      id: i,
    };
    snakes.push(snake);
    // här ska jag lägga till såd et finns en food per player?
    // foods.push(food);
  }
  return snakes;
}

function createTeamSnakes(players) {
  const playerKeys = Object.keys(players);
  const startingY = 100;
  const startingX = 300;
  const snakes = [];
  const nrOfSnakes = playerKeys;
  // coop snakes här vil jag kunna hitta ultimata updelningen. man ska kunna vara 2 eller 4 per orm. om det är ojämnt antal får man vara en 3a.
  // chunkify tar in playerkeys och en siffra på hur många snakes det ska vara och delar upp dem men då behöver jag veta hur många snakes jag vill ha?
  // kanske får göra en helt egen chunkify? behöver veta hur mågna snakes jag vill ha och sen kanske det löser sig självt i loopen

  for (let i = 0; i < playerKeys.length; i++) {
    const player = players[playerKeys[i]];
    const snake = {
      playerKeys: [player.key],
      direction: 'right',
      id: i,
      score: 0,
      body: [{
        x: startingX,
        y: startingY,
      }, {
        x: startingX - gridSize,
        y: startingY,
      }, {
        x: startingX - (gridSize * 2),
        y: startingY,
      }, {
        x: startingX - (gridSize * 3),
        y: startingY,
      }],

    };
    snakes.push(snake);
    // här ska jag lägga till såd et finns en food per player?
    // foods.push(food);
  }
  return snakes;
}
function createCoopSnakes(players) {
  // alla players kontrollerar samma snake. antingen med en knapp var, eller så har alla alla knappar?
  // kanske en spelare får bara 1 klick? samarbetesövning.
  const playerKeys = Object.keys(players);
  const startingY = 90;
  const startingX = 300;
  const snakes = [];
  const snake = {
    playerKeys,
    direction: 'right',
    actions: ['up', 'down', 'right', 'left'],
    score: 0,
    color: SNAKE_COLORS[Math.floor(Math.random() * SNAKE_COLORS.length)],
    name: SNAKE_NAMES[Math.floor(Math.random() * SNAKE_NAMES.length)],
    id: 0,
    body: [{
      x: startingX,
      y: startingY,
    }, {
      x: startingX - gridSize,
      y: startingY,
    }, {
      x: startingX - (gridSize * 2),
      y: startingY,
    }, {
      x: startingX - (gridSize * 3),
      y: startingY,
    }],
  };
  snakes.push(snake);
  return snakes;
}
const SNAKE_COLORS = ['#F44336',
  '#9C27B0',
  '#2196F3',
  '#4CAF50',
  '#FFEB3B',
  '#FF9800',
  '#607D8B',
  '#795548',
  '#E91E63',
  '#3F51B5',
  '#673AB7',
  '#00BCD4',
  '#03A9F4',
  '#8BC34A',
  '#CDDC39',
  '#009688',
  '#FFC107',
  '#FF5722',
];
const SNAKE_NAMES = ['Stan',
  'Jane',
  'Sara',
  'Dan',
  'Lisa',
  'Joe',
  'Rose',
  'Ray',
  'Lyra',
  'Sam',
  'Lucy',
  'Ben',
  'Noa',
  'Mark',
  'Eve',
  'Ned',
  'Ann',
  'Todd'];
const gridSize = 20;
class SnakeStarting extends Component {
  constructor(props) {
    super(props);
    this.startCounter();
    this.nextPhase = this.nextPhase.bind(this);
  }

  startCounter() {
    const that = this;
    let counter = 5;
    const i = setInterval(() => {
      counter -= 1;
      if (counter === 0) {
        that.nextPhase();
        clearInterval(i);
      }
    }, 1000);
    return 5;
  }

  nextPhase() {
    const { game, gameFunc } = this.props;
    let snakes = [];
    const snakeGenerator = {
      classic: createSnakes(game.players),
      team: createTeamSnakes(game.players),
      coop: createCoopSnakes(game.players),
    };
    snakes = snakeGenerator[game.minigame.multiplayerMode];

    for (let i = 0; i < snakes.length; i++) {
      const actionChunks = chunkify(snakes[i].actions, snakes[i].playerKeys.length);
      for (let j = 0; j < snakes[i].playerKeys.length; j++) {
        const player = game.players[snakes[i].playerKeys[j]];
        player.snakeId = snakes[i].id;
        player.controlActions = actionChunks[j];
      }
    }

    game.minigame.snakes = snakes;
    game.phase = 'gameplay';
    gameFunc.update(game);
  }

  render() {
    return (
      <div className="phase-container">
        <Typography variant="h2">Starting game</Typography>
        <CountdownAnimation speed="slow" />
      </div>
    );
  }
}
SnakeStarting.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default SnakeStarting;
