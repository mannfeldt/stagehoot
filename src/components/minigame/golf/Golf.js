import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as p2 from 'p2';
import { fire } from '../../../base';

import * as util from './GolfUtil';
import {
  WIDTH, HEIGHT, HOLE_HEIGHT,
  HOLE_CURVE_DEPTH,
  HOLE_WIDTH,
  BALL_RADIUS,
  TIMER_MS,
  PLAYER_COLORS,
} from './GolfConstants';

let ctx;
let canvas;
const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10; // Max sub steps to catch up with the wall clock
let lastTime;
// jag behöver lyssna på nya slag från firebase: [power, angle, ballstatus: moving]
// jag behöver updatera firebase varje gång en boll är redo för att slås(distans kvar, ballstatus: [awaitingSwing, moving, inhole, outOfPlay )

// kolla på exempelspelen på p2. https://github.com/schteppe/p2.js/blob/master/examples/canvas/character.html
// använda samma koncept av en init funktion och en animation. precis som med snake, inte massa olika komponenter osv.
// ha en drawBall/drawballs drawGround/drawlevel som gör ctx.rectfill osv likt p2 exempel.
// använd p2s eventhandlers? för att se om en boll är i hålet.
// och sen då synkningarna mot firebase med bara den väsentliga infomrationen som både host och play behöver. SwingData, bollstatus, distans, osv.
// Försök att inte använda utilMetoderna utan börja med att utveckla egna metoder med inspiration från manygolf bara.

// 1. init() skapar ett game, world, balls, osv. kopplar bollar till playerkeys. updaterar players med ballsId (precis som snakes).
// initierar lyssnare för varje boll kopplat till player/swing etc i firebase, likt snake
// skapa eventhandlers i p2. Som kollar om någon boll är i hålet, om någon boll är out of bounds?
// 2. skapa en animation-loop och metoder för att rita ut alla komponenter: boll, ground, hole, level, world ....
// skapa winConditions. alltså när alla bollar har status: inhole så är det klart.
// 3. lägg till golfController där man lyssnar på balls[playerkey] likt snake. och när bollen har status WAITING_SWING så kan man svinga med mobilen och data synkas till firebase
// och läses in i host som sätter en veolocify på ball.body
function drawBall(x, y, fill, stroke, playerState) {
  // ball border width
  ctx.lineWidth = 1;

  // if (playerState && playerState === PlayerState.leftRound) {
  //   // make fill translucent
  //   ctx.fillStyle = tinycolor(fill).setAlpha(0.5).toRgbString();
  //   ctx.strokeStyle = tinycolor(stroke).setAlpha(0.5).toRgbString();
  // } else {
  //   ctx.fillStyle = fill;
  //   ctx.strokeStyle = stroke;
  // }

  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS - ctx.lineWidth / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

class Golf extends Component {
  constructor(props) {
    super(props);
    // för att göra det mer smooth. så behöver jag typ dela upp ätandet så att det sker i flera tick? för just nu är ett tick storleken på food och allt annat
    // lite delay när jag ökar speeden. är det olika delay för olika snakes? optimera senare.

    this.state = {
      levelData: null,
      world: null,
      level: null,
      players: props.players, // I.map()
      startTime: null,
      expTime: null,
      holeSensor: null,
      time: 0,
      leaderId: null,
      matchEndTime: null,
    };
    // golf
    this.init = this.init.bind(this);
    this.ensurePlayersInBounds = this.ensurePlayersInBounds.bind(this);
    this.swing = this.swing.bind(this);
    this.drawGround = this.drawGround.bind(this);

    this.renderFrame = this.renderFrame.bind(this);
    this.animate = this.animate.bind(this);


    this.initControllerListener = this.initControllerListener.bind(this);
    this.isEndGame = this.isEndGame.bind(this);
    this.nextPhase = this.nextPhase.bind(this);
  }


  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate() {
    // kan jag ha det här?

    return false;
  }

  ensurePlayersInBounds() {
    // loppa alla bollar som inte är scored och alla bollar som är outofbounds(alltså för stort eller litet x/y värde resetas till startPos
    // eller senaste positionen kanske?
  }

  // lägg till en knapp som kör swingmetoden och slår till bollen med fast värde. nästa teg är sen att bygga kontrollern och synka ihop det via firebase
  //  1. behöver sen spara antal slag
  //  2. snygga till banan, ser att var asuddigt nu. kanske är den här instäällningen på kanvas med skarpa kanter? kolla mot manygolf

  drawBalls() {
    const { players, holeSensor } = this.state;

    const len = players.length;
    for (let i = 0; i < len; i++) {
      const player = players[i];
      const pos = player.ball.interpolatedPosition;
      drawBall(pos[0], pos[1], player.color, 'black', player.state);
    }


    // players.forEach((player) => {
    //   // Don't render ghost for the current player
    //   // if (player.id === state.id && !debugRender) {
    //   //   return;
    //   // }

    //   const pos = player.ball.interpolatedPosition;
    //   drawBall(pos[0], pos[1], player.color, 'black', player.state);

    //   // if (state.match.leaderId === player.id) {
    //   //   drawCrown(ctx, pos[0], pos[1]);
    //   // }
    // });
  }

  drawGround() {
    const { level } = this.state;
    const { points } = level;

    this.drawBalls();

    ctx.fillStyle = 'green';
    const groundLineWidth = 3;
    ctx.lineWidth = groundLineWidth;

    ctx.beginPath();
    const firstPoint = points[0];
    ctx.moveTo(firstPoint[0], firstPoint[1]);

    points.slice(1).forEach((point) => {
      ctx.lineTo(point[0], point[1]);
    });

    // draw a complete shape so fill works
    // add padding so the outline stroke doesn't show up
    ctx.lineTo(WIDTH + groundLineWidth, points[points.length - 1][1]);
    ctx.lineTo(WIDTH + groundLineWidth, HEIGHT + groundLineWidth);
    ctx.lineTo(-groundLineWidth, HEIGHT + groundLineWidth);
    ctx.lineTo(-groundLineWidth, points[0][1]);

    ctx.strokeStyle = level.color;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  swing(velocity, ballIndex = 0) {
    // se till att swingen är åt rätt håll. kolla vart hålet är relativt till bollen och räkna om velocity iståfall?
    const { balls, players } = this.state;
    const ballToHit = balls.findIndex(b => b.ballIndex === ballIndex);
    players[ballToHit].state = 'MOVING';
    players[ballToHit].swing.strokes += 1;
    this.syncPlayersToFirebase(players);
    this.setState(() => {
      balls[ballToHit].velocity[0] = velocity.x || 100;
      balls[ballToHit].velocity[1] = velocity.y || 100;
      return { balls, players };
    });
  }

  init() {
    const { game } = this.props;
    canvas = document.getElementById('golfcanvas');
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    const level = util.addHolePoints(util.levelGen());
    const world = util.createWorld();

    //
    const groundBodies = util.createGround(level);
    const createdHoleSensor = util.createHoleSensor(level.hole);

    for (const body of groundBodies) {
      world.addBody(body);
    }

    world.addBody(createdHoleSensor);
    const playerKeys = Object.keys(game.players);
    const len = playerKeys.length;
    const createdPlayers = [];
    const createdBalls = [];
    for (let i = 0; i < len; i++) {
      const ball = util.createBall(level.spawn);
      // hur håller jag koll på vilken boll som är vilken spelare?
      ball.playerKey = playerKeys[i];
      ball.ballIndex = i;
      world.addBody(ball);
      const player = Object.assign({
        ballIndex: i,
        ball,
        key: playerKeys[i],
        color: PLAYER_COLORS[i],
        state: 'STILL',
        scored: false,
        score: 0,
        swing: {
          strokes: 0,
        },
      }, game.players[playerKeys[i]]);
      createdBalls.push(ball);
      createdPlayers.push(player);
    }
    //

    this.setState(() => ({
      players: createdPlayers,
      world,
      level,
      balls: createdBalls,
      holeSensor: createdHoleSensor,
      startTime: Date.now(),
      expTime: Date.now() + TIMER_MS,
    }));

    createdPlayers.forEach(player => this.initControllerListener(player));
    // event ball in hole
    world.on('beginContact', (evt) => {
      // createHoleSensor body
      const { balls, holeSensor } = this.state;
      if (evt.bodyA !== holeSensor && evt.bodyB !== holeSensor) return;
      const ballBody = evt.bodyA === holeSensor ? evt.bodyB : evt.bodyA;
      const playerKey = ballBody.playerKey;
      alert(`${this.props.game.players[playerKey].name} scored!`);
      // update players state with whatever. and uppdate firebase
      ballBody.scored = true;
      this.setState(() => balls);
    });

    world.on('postStep', (evt) => {
      // createHoleSensor body
      const { balls, players } = this.state;
      const stillBalls = balls.filter(x => x.velocity[0] === 0 && x.velocity[1] === 0);
      if (stillBalls.length === 0) {
        return;
      }
      const playersToUpdateState = players.filter(x => x.state !== 'STILL' && stillBalls.includes(x.ball));
      if (playersToUpdateState.length === 0) {
        return;
      }
      const newPlayerState = players.map((player, index) => {
        if (playersToUpdateState.some(x => x.key === player.key)) {
          player.state = 'STILL';
          return player;
        }
        return player;
      });
      this.syncPlayersToFirebase(newPlayerState);

      this.setState(state => newPlayerState);
      // update players state with whatever. and uppdate firebase
    });

    this.syncToFirebase(createdPlayers);
    requestAnimationFrame(this.animate);
  }

  syncPlayersToFirebase(players) {
    const { game, gameFunc } = this.props;
    game.players = players.reduce((_result, player) => {
      const result = _result;
      result[player.key].ballIndex = player.ballIndex;
      result[player.key].color = player.color;
      result[player.key].state = player.state;
      result[player.key].scored = player.scored;
      result[player.key].score = player.score;
      result[player.key].swing = player.swing;
      return result;
    }, game.players);
    gameFunc.update(game);
  }

  syncToFirebase(players) {
    const { game, gameFunc } = this.props;

    game.players = players.reduce((_result, player) => {
      const result = _result;
      result[player.key].ballIndex = player.ballIndex;
      result[player.key].color = player.color;
      result[player.key].state = player.state;
      result[player.key].scored = player.scored;
      result[player.key].score = player.score;
      result[player.key].swing = player.swing;
      return result;
    }, game.players);

    game.status = 'IN_PROGRESS';
    game.minigame.round = 1;
    gameFunc.update(game);
  }

  nextPhase() {
    const { game, gameFunc } = this.props;
    if (game.minigame.round === game.minigame.holes) {
      game.phase = 'final_result';
    } else {
      game.phase = 'level_completed';
      game.minigame.round += 1;
    }
    gameFunc.update(game);
  }

  animate(time) {
    const { world } = this.state;
    requestAnimationFrame(this.animate);

    const deltaTime = lastTime ? (time - lastTime) / 500 : 0;

    // Move bodies forward in time
    world.step(fixedTimeStep, deltaTime, maxSubSteps);

    // ensurePlayersInBounds();
    this.renderFrame();
    if (this.isEndGame()) {
      // this.nextPhase();
    }
    lastTime = time;
  }


  initControllerListener(player) {
    const { game } = this.props;
    const { balls } = this.state;
    const swingRef = fire.database().ref(`/games/${game.key}/players/${player.key}/swing`);
    const that = this;
    swingRef.on('value', (snapshot) => {
      const swingData = snapshot.val();
      if (swingData && swingData.strokes > player.swing.strokes) {
        that.swing(swingData, player.ballIndex);
      } else {
        console.log('move error');
      }
    });
  }


  isEndGame() {
    const { expTime } = this.state;
    if (Date.now() > expTime) {
      return true;
    }
    return false;
  }

  renderFrame() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Transform the canvas
    // Note that we need to flip the y axis since Canvas pixel coordinates
    // goes from top to bottom, while physics does the opposite.
    ctx.save();

    this.drawGround();
    this.drawBalls();
  }

  // informationen mellan varje bana är i en annan phase? en annan komponent?
  render() {
    return (
      <div className="phase-container" id="golfboard">
        <canvas id="golfcanvas" height={HEIGHT} width={WIDTH} />
        <button onClick={this.swing}>swing</button>
      </div>
    );
  }
}
Golf.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default Golf;
