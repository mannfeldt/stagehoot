import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as p2 from 'p2';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { fire } from '../../../base';

// http://jsfiddle.net/AceJJ/1748/ fireworks
import * as util from './GolfUtil';
import {
  WIDTH, HEIGHT, HOLE_HEIGHT,
  HOLE_CURVE_DEPTH,
  HOLE_WIDTH,
  HURRY_UP_MS,
  AIR_COLOR,
  GRASS_COLOR,
  BALL_RADIUS,
  TIMER_MS,
  PLAYER_COLORS,
  CLUBS,
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
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
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
    const canvasHeight = Math.floor(window.innerHeight - 160);
    const canvasWidth = Math.floor(window.innerWidth);
    this.state = {
      phase:'PLAY',
      levelData: null,
      world: null,
      level: null,
      players: props.players, // I.map()
      startTime: null,
      expTime: null,
      holeSensor: null,
      time: 0,
      canvasHeight,
      canvasWidth,
      leaderId: null,
      matchEndTime: null,
      testacceleration: 100,
      testClubIndex: 2,
      testBallIndex: 0,
      balls: null,
    };
    // golf
    this.init = this.init.bind(this);
    this.ensurePlayersInBounds = this.ensurePlayersInBounds.bind(this);
    this.swing = this.swing.bind(this);
    this.drawGround = this.drawGround.bind(this);
    this.drawHud = this.drawHud.bind(this);
    this.renderFrame = this.renderFrame.bind(this);
    this.animate = this.animate.bind(this);
    this.testSwing = this.testSwing.bind(this);
    this.syncPlayersObjectToFirebase = this.syncPlayersObjectToFirebase.bind(this);
    this.initControllerListener = this.initControllerListener.bind(this);
    this.isEndGame = this.isEndGame.bind(this);
    this.nextPhase = this.nextPhase.bind(this);
  }


  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate() {
    // kan jag ha det här?

    return true;
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };


  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  ensurePlayersInBounds() {
    const { balls, canvasWidth, level } = this.state;
    const ensuredBalls = balls.map((ball) => {
      const result = ball;
      if (ball.interpolatedPosition[0] < 0 || ball.interpolatedPosition[0] > canvasWidth) {
        result.position = [level.spawn[0], level.spawn[1] - BALL_RADIUS];
        result.velocity = [0, 0];
      }
      return result;
    });

    this.setState(() => ({
      balls: ensuredBalls,
    }));

    // loppa alla bollar som inte är scored och alla bollar som är outofbounds(alltså för stort eller litet x/y värde resetas till startPos
    // eller senaste positionen kanske?
  }

  // lägg till en knapp som kör swingmetoden och slår till bollen med fast värde. nästa teg är sen att bygga kontrollern och synka ihop det via firebase
  //  1. behöver sen spara antal slag
  //  2. snygga till banan, ser att var asuddigt nu. kanske är den här instäällningen på kanvas med skarpa kanter? kolla mot manygolf

  drawBalls() {
    const { balls } = this.state;
    const { game } = this.props;
    const players = Object.values(game.players);

    const len = players.length;
    for (let i = 0; i < len; i++) {
      const player = players[i];
      const pos = balls[player.ballIndex].interpolatedPosition;
      drawBall(pos[0], pos[1], player.color, 'gray', player.state);
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

  // långting är off med drawground. antingen i den eller i levelgen eller någon annan util metod.
  // blev så när jag bytte constans.height och width till state här som är baserat på window
  drawGround() {
    const { level, canvasHeight, canvasWidth } = this.state;
    const { points } = level;

    this.drawBalls();

    ctx.fillStyle = level.color;
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

    ctx.lineTo(canvasWidth + groundLineWidth, points[points.length - 1][1]);
    ctx.lineTo(canvasWidth + groundLineWidth, canvasHeight + groundLineWidth);
    ctx.lineTo(-groundLineWidth, canvasHeight + groundLineWidth);
    ctx.lineTo(-groundLineWidth, points[0][1]);

    ctx.strokeStyle = GRASS_COLOR;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  drawHud() {
    const {
      expTime, level, canvasHeight, canvasWidth,
    } = this.state;
    const { game } = this.props;
    ctx.font = '24px roboto';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Hole ${game.minigame.round} Par ${level.par}`, 15, 24);
    const timeRemaining = Math.floor((expTime - Date.now()) / 1000);
    ctx.fillText(timeRemaining, canvasWidth / 2, 24);
    const scoredTextHeight = 40;
    Object.values(game.players).filter(x => x.state === 'SCORED')
      .sort((a, b) => a.scoreTime > b.scoreTime)
      .slice(0, 3)
      .forEach((p, index) => ctx.fillText(`${p.name} gick i hål med ${p.swing.strokes} slag på ${p.scoreTime} sekunder`, canvasWidth / 2, scoredTextHeight * (1 + index)));
    // funkar typ men försvinner snabbt... ska stanna kvar tills ny kommer och petar ner den. upp till 3 samtida som visas. en per rad.

    // lägg till info om vilken hål det här är. hål x? kolla på game.round? vilket par är det?
    // tid kvar?
  }

  testSwing() {
    const { testacceleration, testClubIndex, testBallIndex } = this.state;
    const club = CLUBS[testClubIndex];
    const swing = util.getSwingData(club, testacceleration);
    this.swing(swing, testBallIndex, true);
  }

  swing(velocity, ballIndex, test) {
    const { balls, holeSensor } = this.state;
    const { game: { players } } = this.props;
    const ballToHit = balls.find(b => b.ballIndex === ballIndex);
    players[ballToHit.playerKey].state = 'MOVING';

    const holeX = holeSensor.interpolatedPosition[0];
    // kanske bara kan göra ballToHit.interpolatedpostion.... istället för att hämta från balls array igen? samma med setstate behöver inte göras då?
    // utan kan bara göra return balls direkt efter att jag gjort ändringen på balltohit
    const ballX = balls[ballToHit.ballIndex].interpolatedPosition[0];
    const velocityWithDirection = { ...velocity, y: -velocity.y };
    // bollen är förbi hålet
    if (ballX > holeX) {
      velocityWithDirection.x = -velocityWithDirection.x;
    }
    this.syncPlayersObjectToFirebase(players);

    this.setState(() => {
      balls[ballToHit.ballIndex].velocity[0] = velocityWithDirection.x;
      balls[ballToHit.ballIndex].velocity[1] = velocityWithDirection.y;
      return { balls, players };
    });
  }

  init() {
    const { game } = this.props;
    const { canvasHeight, canvasWidth } = this.state;
    canvas = document.getElementById('golfcanvas');
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;
    const level = util.addHolePoints(util.levelGen(canvasWidth, canvasHeight, true));
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
    const playerColors = util.getPlayerColors(len);
    for (let i = 0; i < len; i++) {
      const ball = util.createBall(level.spawn);
      // hur håller jag koll på vilken boll som är vilken spelare?
      ball.playerKey = playerKeys[i];
      ball.ballIndex = i;
      ball.scored = false;
      world.addBody(ball);
      const player = Object.assign({
        ballIndex: i,
        key: playerKeys[i],
        color: playerColors[i],
        state: 'STILL',
        distance: util.getDistanceYards(level.hole[0], level.spawn[0]),
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
      world,
      level,
      balls: createdBalls,
      holeSensor: createdHoleSensor,
      startTime: Date.now(),
      expTime: Date.now() + level.time,
    }));

    createdPlayers.forEach(player => this.initControllerListener(player));
    // event ball in hole
    world.on('beginContact', (evt) => {
      // createHoleSensor body
      const {
        balls, holeSensor, startTime, expTime,
      } = this.state;
      const { game: _game } = this.props;
      const players = Object.values(_game.players);
      if (evt.bodyA !== holeSensor && evt.bodyB !== holeSensor) return;
      const ballBody = evt.bodyA === holeSensor ? evt.bodyB : evt.bodyA;
      const { playerKey } = ballBody;

      // alert(`${this.props.game.players[playerKey].name} scored!`);
      // update players state with whatever. and uppdate firebase
      ballBody.scored = true;
      const newExpTime = expTime > Date.now() + (HURRY_UP_MS * 1000) ? Date.now() + (HURRY_UP_MS * 1000) : expTime;

      this.setState(() => ({
        balls,
        expTime: newExpTime,
      }));

      const newPlayerState = players.map(p => (p.key === playerKey ? { ...p, state: 'SCORED', scoreTime: Math.floor((Date.now() - startTime) / 1000) } : p));
      this.syncPlayersToFirebase(newPlayerState);
    });

    world.on('postStep', (evt) => {
      // createHoleSensor body
      const { balls } = this.state;
      const { game: _game } = this.props;
      const players = Object.values(_game.players);
      const stillBalls = balls.filter(x => x.velocity[0] === 0 && x.velocity[1] === 0);
      if (stillBalls.length === 0) {
        return;
      }
      const playersToUpdateState = players.filter(x => x.state === 'MOVING' && stillBalls.some(b => x.key === b.playerKey));
      if (playersToUpdateState.length === 0) {
        return;
      }
      const newPlayerState = players.map((player, index) => {
        if (playersToUpdateState.some(x => x.key === player.key)) {
          return { ...player, state: 'STILL', distance: util.getDistanceYards(level.hole[0], balls[player.ballIndex].interpolatedPosition[0]) };
        }
        return player;
      });
      this.syncPlayersToFirebase(newPlayerState);

      //      this.setState(state => newPlayerState);
      // update players state with whatever. and uppdate firebase
    });

    this.syncToFirebase(createdPlayers, level);
    requestAnimationFrame(this.animate);
  }

  syncPlayersToFirebase(players) {
    const { game, gameFunc } = this.props;
    game.players = players.reduce((_result, player) => {
      const result = _result;
      result[player.key] = player;
      return result;
    }, game.players);
    gameFunc.update(game);
  }

  syncPlayersObjectToFirebase(playersObj) {
    const { game, gameFunc } = this.props;
    game.players = playersObj;
    gameFunc.update(game);
  }

  syncToFirebase(players, level) {
    const { game, gameFunc } = this.props;

    game.players = players.reduce((_result, player) => {
      const result = _result;
      result[player.key] = player;
      return result;
    }, game.players);
    game.status = 'IN_PROGRESS';
    game.minigame.levelColor = level.color;
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
    const { world, phase } = this.state;
    requestAnimationFrame(this.animate);

    const deltaTime = lastTime ? (time - lastTime) / 400 : 0;

    // Move bodies forward in time
    world.step(fixedTimeStep, deltaTime, maxSubSteps);

    this.ensurePlayersInBounds();
    this.renderFrame();
    if (phase==="PLAY" && this.isEndGame()) {
      //ska poäng bara ges för placering inbördes? eller poäng för slagen? båda? tröstpoäng om man inte klarar banan

      //struktuerar om. ha phase switchcondition runt mera saker. för är vi i pausscreen kanske det är onödigt att köra esnureplayersisinbounds etc
      //sätt phase till leaderboard,
      // giveoutpoints
      // showleaderboard (automaticly goes to next level after 10 sec, setState(nextLevelTimer = date.now() + 10sekunder))
      //
      //gör en else eller annan if efter här som kollar om phase==='leaderboard' && nextLevelTimer har gått ut.
      //om det är sant så ska nästa level laddas. använd npgon variant av init. loadNextLevel();
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
    const { expTime, balls } = this.state;
    const now = Date.now();
    if (now > expTime) {
      return true;
    }
    //måste testa om denna fungerar. kansek inte känner av när någon balls blir scored? måste kolla på players? varför fungerar inte hurry up grejen?
    if (!balls.some(x => !x.scored)) {
      return true;
    }
    return false;
  }

  // function giveoutPoints

  renderFrame() {
    const { canvasHeight, canvasWidth } = this.state;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Transform the canvas
    // Note that we need to flip the y axis since Canvas pixel coordinates
    // goes from top to bottom, while physics does the opposite.
    ctx.save();

    this.drawGround();
    this.drawBalls();
    this.drawHud();
  }

  // informationen mellan varje bana är i en annan phase? en annan komponent?
  render() {
    const {
      canvasHeight, canvasWidth, testClubIndex, testacceleration, testBallIndex, balls,
    } = this.state;
    return (
      <div className="phase-container" id="golfboard">
        <canvas id="golfcanvas" height={canvasHeight} width={canvasWidth} />
        <button onClick={this.testSwing}>swing</button>
        <FormControl>
          <InputLabel htmlFor="clubc-required">Club</InputLabel>
          <Select
            value={testClubIndex || 0}
            onChange={this.handleChangeSelect}
            name="testClubIndex"
            inputProps={{
              id: 'club-required',
            }}
          >
            {CLUBS.map((c, index) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}

          </Select>
        </FormControl>
        <TextField
          label="Acceleration"
          name="testacceleration"
          type="number"
          value={testacceleration}
          margin="normal"
          onChange={this.handleChange('testacceleration')}
        />
        { balls && (
        <FormControl>
          <InputLabel htmlFor="ball-required">Ball</InputLabel>
          <Select
            value={testBallIndex || 0}
            onChange={this.handleChangeSelect}
            name="testBallIndex"
            inputProps={{
              id: 'ball-required',
            }}
          >
            {balls.map((b, index) => (
              <MenuItem key={b.ballIndex} value={b.ballIndex}>{b.ballIndex}</MenuItem>
            ))}

          </Select>
        </FormControl>
        )}
      </div>
    );
  }
}
Golf.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default Golf;
