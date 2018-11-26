import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fire } from '../../../base';
import * as minigameUtil from '../../common/utils/minigameUtil';

let ctx;
let canvas;
const gridSize = 20;

class Snake extends Component {
  constructor(props) {
    super(props);
    // för att göra det mer smooth. så behöver jag typ dela upp ätandet så att det sker i flera tick? för just nu är ett tick storleken på food och allt annat
    // lite delay när jag ökar speeden. är det olika delay för olika snakes? optimera senare.
    const canvasHeight = Math.floor(window.innerHeight / gridSize) * gridSize;
    const canvasWidth = Math.floor(window.innerWidth / gridSize) * gridSize;
    const nrOfFoods = props.game.minigame.snakes.length * 2;

    this.state = {
      gameTicker: null,
      ticks: 0,
      winners: [],
      snakes: minigameUtil.getSnakesInStartingPosition(props.game.minigame.snakes, { height: canvasHeight, width: canvasWidth }),
      foods: minigameUtil.getInitialFoods(nrOfFoods),
      settings: {
        snake: {
          size: gridSize,
          speed: props.game.minigame.difficulty,
          border: '#000',
          respawntime: 3,
        },
        food: {
          background: '#EC5E0B',
          border: '#73AA24',
        },
        canvas: {
          height: canvasHeight,
          width: canvasWidth,
          background: '#F5F5F5',
          border: '#000',
        },
      },
    };

    this.drawSnakes = this.drawSnakes.bind(this);
    this.generateFood = this.generateFood.bind(this);
    this.generateSnakes = this.generateSnakes.bind(this);
    this.resetCanvas = this.resetCanvas.bind(this);
    this.drawFood = this.drawFood.bind(this);
    this.detectCollisions = this.detectCollisions.bind(this);
    this.initControllerListener = this.initControllerListener.bind(this);
    this.generateFoods = this.generateFoods.bind(this);
    this.isEndGame = this.isEndGame.bind(this);
    this.togglePausGame = this.togglePausGame.bind(this);
    this.renderOverlay = this.renderOverlay.bind(this);
    this.nextPhase = this.nextPhase.bind(this);
  }


  componentDidMount() {
    const {
      snakes, settings,
    } = this.state;
    const app = document.querySelector('#snakeboard');

    canvas = app.querySelector('canvas');
    ctx = canvas.getContext('2d');
    this.resetCanvas();
    this.generateSnakes();
    this.generateFoods();
    const that = this;
    const gameTicker = setInterval(() => {
      if (that.state.isPaused) {
        if (that.state.overlay) {
          return;
        }
        that.renderOverlay();
        return;
      }
      if (that.state.winners.length === 0) {
        that.resetCanvas();
        that.generateSnakes();
        that.generateFoods();
        that.detectCollisions();
        that.isEndGame();
      } else {
        that.nextPhase();
      }
    }, settings.snake.speed);

    this.setState({ gameTicker });
    for (let i = 0, len = snakes.length; i < len; i++) {
      const snake = snakes[i];
      this.initControllerListener(snake);
    }
  }

  shouldComponentUpdate() {
    // kan jag ha det här?

    return false;
  }

  togglePausGame = () => {
    // async!!
    this.setState(state => ({
      isPaused: !state.isPaused,
      overlay: false,
    }));
  }

  nextPhase() {
    const {
      gameTicker, snakes, winners, ticks,
    } = this.state;
    const { game, gameFunc } = this.props;
    clearInterval(gameTicker);
    game.minigame.snakes = snakes;
    game.minigame.winners = winners;
    game.minigame.ticks = ticks;
    game.phase = 'final_result';
    gameFunc.update(game);
  }

  initControllerListener(snake) {
    const { game } = this.props;
    const snakeRef = fire.database().ref(`/games/${game.key}/minigame/snakes/${snake.id}`);
    const that = this;
    snakeRef.on('value', (snapshot) => {
      const nextSnake = snapshot.val();
      if (nextSnake && !that.state.isPaused) {
        that.setState((state) => {
          const snakes = [...state.snakes];
          // kolla så att detta är okej sätt, blir snakes index alltid rätt kopplat till snake.id? ska jag fixa ett riktigt ID för att vara säker? alltså ett pushid
          if (nextSnake.move) {
            snakes[snake.id].moves.push(nextSnake.move);
          }
          return {
            snakes,
          };
        });
      } else {
        console.log('move error');
      }
    });
  }


  isEndGame() {
    const { snakes } = this.state;
    const { game: { minigame: { gamemode, racetarget } } } = this.props;

    // if survavalmode continue game if more than 1 snake is alive
    // kolla performance på denna filter funktion jämfört med loopen under
    if (gamemode === 'survival' && snakes.filter(s => !s.dead).length > 1) {
      return;
      /*
      const l = snakes.length;
      let alive = 0;
      for (let i = 0; i < l; i++) {
        if (!snakes[i].dead) {
          alive += 1;
        }
        if (alive > 1) {
          return;
        }
      }
      */
    }
    // if race continue game if no one has reached racetarget
    if (gamemode === 'race' && !snakes.some(s => s.body.length >= racetarget)) {
      return;
    }

    // its gameover, lets find the winner/winners
    let winners = [];
    if (gamemode === 'survival') {
      const alive = snakes.filter(s => !s.dead);
      if (alive.length === 1) {
        winners = alive;
      } else {
        const winner = snakes.reduce((prev, current) => ((prev.score > current.score) ? prev : current));
        winners.push(winner);
      }
    } else if (gamemode === 'race') {
      winners = snakes.filter(s => s.body.length >= racetarget);
    }
    this.setState(() => ({
      winners,
      isPaused: true,
      overlay: false,
    }));

    /*

    if (gamemode === 'survival') {
      if (snakes.length === 1 && snakes[0].dead) {
        winners.push(snakes[0]);
      } else {
        for (let i = 0; i < l; i++) {
          if (!snakes[i].dead) {
            winners.push(snakes[i]);
          }
          // should not be possible as she check for this first thing in this function
          // if (winners.length > 1) {
          //  return;
          // }
        }
        // om det inte finns någon levande alla så betyder det att de sista tog samtidigt. då vinner den som är längst av alla
        if (winners.length === 0) {
          let winnerIndex = 0;
          let highestScore = 0;
          for (let i = 0; i < l; i++) {
            if (snakes[i].score > highestScore) {
              winnerIndex = i;
              highestScore = snakes[i].score;
            }
          }
          winners.push(snakes[winnerIndex]);
        }
      }
    } else if (gamemode === 'race') {
      for (let i = 0; i < l; i++) {
        if (snakes[i].body.length >= racetarget) {
          winners.push(snakes[i]);
        }
      }
    }
    if (winners.length > 0) {
      this.setState(() => ({
        winners,
        isPaused: true,
        overlay: false,
      }));
    }
    */
  }

  resetCanvas() {
    const { settings } = this.state;
    canvas.width = settings.canvas.width;
    canvas.height = settings.canvas.height;

    ctx.fillStyle = settings.canvas.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  generateSnakes() {
    // i alla såna här dpelarspecifika metoder måste jag ta in vilken snake/player det gäller
    const { snakes, foods, settings } = this.state;
    const { game } = this.props;
    const nextSnakes = [];
    const teleportSnakes = !game.minigame.wallCollision;
    for (let i = 0, len = snakes.length; i < len; i++) {
      // behöver jag göra en copy? spelar det någon roll?
      const snake = snakes[i];
      if (snake.respawning) {
        if (Date.now() > snake.respawntime) {
          snake.dead = false;
          snake.respawning = false;
        }
        nextSnakes.push(snake);
        continue;
      } else if (snake.dead) {
        if (game.minigame.gamemode === 'survival') {
          snake.body = [];
          nextSnakes.push(snake);
          continue;
        } else if (game.minigame.gamemode === 'race') {
          const xMax = settings.canvas.width - gridSize;
          const yMax = settings.canvas.height - gridSize;
          const startPos = minigameUtil.getRandomCanvasPositionMargin(yMax, xMax);
          snake.body = [{
            x: startPos.x,
            y: startPos.y,
          }, {
            x: startPos.x - gridSize,
            y: startPos.y,
          }, {
            x: startPos.x - (gridSize * 2),
            y: startPos.y,
          }, {
            x: startPos.x - (gridSize * 3),
            y: startPos.y,
          }];
          snake.direction = 'right';
          snake.respawning = true;
          snake.respawntime = Date.now() + (settings.snake.respawntime * 1000);
          nextSnakes.push(snake);
          continue;
        }
      }
      // testa denna perfomance mot tidigare switch. ngåon skillnad? kan tänka mig att denna är lite långsammare då jag måste definera alla 4directions varje gång
      const movement = {
        up: {
          x: snake.body[0].x,
          y: teleportSnakes && (snake.body[0].y === 0) ? canvas.height - gridSize : snake.body[0].y - gridSize,
        },
        down: {
          x: snake.body[0].x,
          y: teleportSnakes && (snake.body[0].y >= canvas.height - gridSize) ? 0 : snake.body[0].y + gridSize,
        },
        right: {
          x: teleportSnakes && (snake.body[0].x >= canvas.width - gridSize) ? 0 : snake.body[0].x + gridSize,
          y: snake.body[0].y,
        },
        left: {
          x: teleportSnakes && (snake.body[0].x === 0) ? canvas.width - gridSize : snake.body[0].x - gridSize,
          y: snake.body[0].y,
        },
      };
      const nextMove = snake.moves.shift();
      if (!minigameUtil.isInvalidMove(nextMove, snake.direction)) {
        snake.direction = nextMove;
      }

      // The snake moves by adding a piece to the beginning "this.snake.unshift(coordinate)" and removing the last piece "this.snake.pop()"
      // Except when it eats the food in which case there is no need to remove a piece and the added piece will make it grow
      const coordinate = movement[snake.direction];
      snake.body.unshift(coordinate);

      const collidedFood = foods.find(f => f.active && snake.body[0].x === f.x && snake.body[0].y === f.y);

      if (collidedFood) {
        snake.score += 10;
        collidedFood.active = false;
      } else {
        snake.body.pop();
      }
      nextSnakes.push(snake);
    }
    this.setState(state => ({
      snakes: nextSnakes,
      foods,
      ticks: state.ticks + 1,
    }));
    // kan det inte blir problem här? litar jag på att state.snakes hunnit updateras innan de ritas ut? ska jag inte skicka in det? drawSnakes(nextSNakes)
    // och sen updaterar jag state efteråt?
    this.drawSnakes(nextSnakes);
  }

  drawSnakes(nextSnakes) {
    const { settings, ticks } = this.state;
    ctx.globalCompositeOperation = 'multiply';
    ctx.strokestyle = settings.snake.border;
    for (let i = 0, len = nextSnakes.length; i < len; i++) {
      const snake = nextSnakes[i];
      if (snake.respawning && ticks % 2 === 0) {
        ctx.fillStyle = settings.canvas.background;
      } else {
        ctx.fillStyle = snake.color;
      }
      // Draw each piece

      // om två snakes är över varandra så finns en schysst style för det som han gick igenom på öredev. där färgerna från båda kan blandas till en ljusare eller mörkar.
      for (let j = 0, len2 = snake.body.length; j < len2; j++) {
        const bodyPos = snake.body[j];
        ctx.fillRect(bodyPos.x, bodyPos.y, gridSize, gridSize);
        ctx.strokeRect(bodyPos.x, bodyPos.y, gridSize, gridSize);
      }


      // this.game.direction = this.game.nextDirection;
    }
    /*
        jag kör rakt av på direction, verkar fungera och snabbare response då? om jag vill ha tillbaka nextdirection så ta fram denna metod och sätt i snakeListenern att den ska sätta nextDirection
        this.setState(function (state, props) {
            let snakes = state.snakes;
            for (let i = 0; i < snakes.length; i++) {
                snakes[i].direction = snakes[i].nextDirection;
            }
            return {
                snakes: snakes,
            };
        });
        */
  }

  generateFoods() {
    const { foods } = this.state;
    // fungerar detta? const och ingen kopia? blir det updaterat? risk att allt blir object istället för arrays? cost [foods] = this.state?
    // const nextFoods = [...foods ];
    for (let i = 0, len = foods.length; i < len; i++) {
      let food = foods[i];
      if (!food.active) {
        food = this.generateFood();
      }
      this.drawFood(food);
      foods[i] = food;
    }
    this.setState(() => ({
      foods,
    }));
  }

  generateFood() {
    const { snakes, settings } = this.state;

    const xMax = settings.canvas.width - gridSize;
    const yMax = settings.canvas.height - gridSize;

    const x = Math.round((Math.random() * xMax) / gridSize) * gridSize;
    const y = Math.round((Math.random() * yMax) / gridSize) * gridSize;
    /*
    for (let i = 0, len = snakes.length; i < len; i++) {
      const snake = snakes[i];
      const collision = snake.body.some(b => b.x === x && b.y === y);
      if (collision) {
        return this.generateFood();
      }
    }
    */
    // fungerar denna tro?
    const collision = snakes.some(s => s.body.some(b => b.x === x && b.y === y));
    if (collision) {
      return this.generateFood();
    }
    return {
      active: true,
      x,
      y,
    };
  }

  drawFood(food) {
    const { settings } = this.state;
    // denna metod kallas lite väl många gånger?? ioptimera?
    ctx.fillStyle = settings.food.background;
    ctx.strokestyle = settings.food.border;

    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
  }

  detectCollisions() {
    // bryt ut de olika detectcollision till purecfunctions? optiering viktigt
    // ha olika modes för krock med motståndare
    // 2. krock med motståndare så händer inget
    // 3. krock med motståndare så äts motståndaren upp (head-on-head så dör båda)
    // 4. korck med motståndare så dör man
    // modes krock med vägg:
    // 1. man dör
    // 2. man kommer ut på andra sidan
    // vad händer om man får en selfcollision sammtidigt som någon får en opponentcollision i den?
    // mode dö:
    // när man dör så får man återställs man till liten mask
    // när man dör så är man död för alltid

    // Self collison
    // It's impossible for the first 3 pieces of the snake to self collide so the loop starts at 4

    // fixa en bättre metod för alla snakes senare

    // fundra och test som det här är den mest effektiva lösningen? eller om jag gör några checks i onödan?
    // jag vill nog bara göra en gemensam setState call efter den här loopen. så alla ändringar för t.ex. handleDeath
    let { snakes } = this.state;
    const { game: { minigame } } = this.props;
    for (let i = 0; i < snakes.length; i++) {
      if (snakes[i].dead) {
        continue;
      }
      if (minigameUtil.detectSelfCollision(snakes[i])) {
        // vilken av dessa fungerar?
        snakes[i].dead = true;
        // snakes[i].dead = true;

        // this.handleDeath(snake);
      }
      if (minigame.wallCollision && minigameUtil.detectWallCollision(snakes[i].body[0], canvas.height, canvas.width)) {
        snakes[i].dead = true;
      }
    }

    if (minigame.opponentCollision) {
      // här inne så ändrar jag om i snakes genom att döda dem som ska dödas och klyver om det ska klyvas osv. det som returneras ska vara korrekta snakes
      snakes = minigameUtil.detectOpponentCollision(snakes, minigame.eatOpponents);
    }
    this.setState(() => ({
      snakes,
    }));
  }

  renderOverlay() {
    const { ticks, snakes, winners } = this.state;
    const { game } = this.props;
    this.setState(() => ({
      overlay: true,
    }));
    ctx.globalAlpha = 0.4;
    ctx.textAlign = 'center';
    ctx.font = '100px roboto';
    ctx.fillStyle = '#000000';
    if (ticks === 1) {
      ctx.fillText('Click to start', canvas.width / 2, canvas.height / 2);
    } else if (winners.length > 0) {
      ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
    }
    ctx.globalAlpha = 1;
    ctx.font = '20px roboto';


    for (let i = 0; i < snakes.length; i++) {
      const snake = snakes[i];
      if (!snake.body[0]) {
        continue;
      }
      let headX = Math.max(gridSize, snake.body[0].x);
      let headY = Math.max(gridSize, snake.body[0].y);
      if (headX >= canvas.width) {
        headX = canvas.width - (gridSize * 2);
      }
      if (headY >= canvas.height) {
        headY = canvas.height - (gridSize * 2);
      }
      const snakeName = snake.playerKeys.length === 1 ? game.players[snake.playerKeys[0]].name : snake.name;
      ctx.fillStyle = snake.color;

      const namePosition = {
        right: { textAlign: 'center', yPos: headY - (gridSize / 5) },
        left: { textAlign: 'start', yPos: headY - (gridSize / 5) },
        up: { textAlign: 'start', yPos: headY - (gridSize / 5) },
        down: { textAlign: 'start', yPos: headY + (gridSize * 2) },
      };
      ctx.textAlign = namePosition[snake.direction].textAlign;
      ctx.fillText(snakeName, headX, namePosition[snake.direction].yPos);
    }
  }

  render() {
    return (
      <div className="phase-container" id="snakeboard" role="button" tabIndex={0} onClick={this.togglePausGame} onKeyDown={this.togglePausGame}>
        <canvas />
      </div>
    );
  }
}
Snake.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default Snake;
