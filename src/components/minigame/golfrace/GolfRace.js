import React, { Component } from "react";
import PropTypes from "prop-types";
import * as p2 from "p2";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { fireGolf } from "../../../base";
import golfwood1Audio from "../golf/audio/golfwood.wav";
import golfwood2Audio from "../golf/audio/golfwood2.wav";
import golfwood3Audio from "../golf/audio/golfwood3.wav";
import golfiron1Audio from "../golf/audio/golfiron.wav";
import golfiron2Audio from "../golf/audio/golfiron2.wav";
import golfiron3Audio from "../golf/audio/golfiron3.wav";

import countdownAudio from "../golf/audio/countdown.wav";
import golfclapAudio from "../golf/audio/golfclap.wav";
import golfputtAudio from "../golf/audio/golfputt.wav";
import golfscoreAudio from "../golf/audio/golfscore.wav";

// http://jsfiddle.net/AceJJ/1748/ fireworks
import * as util from "../golf/GolfUtil";
import {
  HURRY_UP_MS,
  GRASS_COLOR,
  MATCH_OVER_MS,
  BALL_RADIUS,
  PENALTY_STROKES,
  CLUBS,
} from "../golf/GolfConstants";

let ctx;
let canvas;
const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10; // Max sub steps to catch up with the wall clock
let lastTime;

function drawBall(
  x,
  y,
  stroke,
  playerColor,
  playerIndex,
  playerState,
  showNameTag,
  playerName,
  canvasHeight
) {
  // ball border width
  ctx.lineWidth = 1;

  ctx.fillStyle = playerColor;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS - ctx.lineWidth / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  if (
    showNameTag &&
    playerState &&
    (playerState === "STILL" || playerState === "MOVING")
  ) {
    let ballIndexMod = playerIndex % 10;
    let poleMin = Math.max(100, canvasHeight * 0.2);
    let poleMax = Math.max(150, canvasHeight * 0.4);
    let indexFactor = (poleMax - poleMin) / 10;
    let poleHeight = poleMin + ballIndexMod * indexFactor;

    ctx.lineWidth = 2;
    ctx.strokeStyle = playerColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - poleHeight);
    ctx.stroke();
    ctx.closePath();

    ctx.font = "20px roboto";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText(playerName, x, y - poleHeight - 5);
  }
}

class GolfRace extends Component {
  constructor(props) {
    super(props);
    // för att göra det mer smooth. så behöver jag typ dela upp ätandet så att det sker i flera tick? för just nu är ett tick storleken på food och allt annat
    // lite delay när jag ökar speeden. är det olika delay för olika snakes? optimera senare.
    const canvasHeight = Math.floor(window.innerHeight - 160);
    const canvasWidth = Math.floor(window.innerWidth);

    const soundEffects = {
      wood: [
        {
          audio: util.createAudio(golfwood1Audio),
          minpower: 400,
        },
        {
          audio: util.createAudio(golfwood2Audio),
          minpower: 300,
        },
        {
          audio: util.createAudio(golfwood3Audio),
          minpower: 200,
        },
      ],
      golfclap: {
        audio: util.createAudio(golfclapAudio),
      },
      iron: [
        {
          audio: util.createAudio(golfiron1Audio),
          minpower: 350,
        },
        {
          audio: util.createAudio(golfiron2Audio),
          minpower: 250,
        },
        {
          audio: util.createAudio(golfiron3Audio),
          minpower: 150,
        },
      ],
      putt: [
        {
          audio: util.createAudio(golfputtAudio),
          minpower: 8,
        },
      ],
      countdown: {
        audio: util.createAudio(countdownAudio),
      },
    };
    this.state = {
      levelData: null,
      world: null,
      level: null,
      startTime: null,
      expTime: null,
      time: 0,
      canvasHeight,
      canvasWidth,
      leaderId: null,
      matchEndTime: null,
      testacceleration: 195,
      testClubIndex: 2,
      testBallIndex: 0,
      balls: null,
      nextLevelTimer: null,
      leaderboard: [],
      soundEffects,
    };
    // golf
    this.init = this.init.bind(this);
    this.ensurePlayersInBounds = this.ensurePlayersInBounds.bind(this);
    this.swing = this.swing.bind(this);
    this.drawGround = this.drawGround.bind(this);
    this.drawPlayHud = this.drawPlayHud.bind(this);
    this.renderFrame = this.renderFrame.bind(this);
    this.animate = this.animate.bind(this);
    this.testSwing = this.testSwing.bind(this);
    this.syncPlayersObjectToFirebase = this.syncPlayersObjectToFirebase.bind(
      this
    );
    this.initControllerListener = this.initControllerListener.bind(this);
    this.isLevelCompleted = this.isLevelCompleted.bind(this);
    this.nextPhase = this.nextPhase.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.setEventHandlers = this.setEventHandlers.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate() {
    // kan jag ha det här?

    return true;
  }

  setEventHandlers(world) {
    world.on("postStep", (evt) => {
      const { balls, level, canvasWidth } = this.state;
      const { game: _game } = this.props;
      const players = Object.values(_game.players);
      const stillBalls = balls.filter(
        (x) => x.velocity[0] === 0 && x.velocity[1] === 0
      );
      if (stillBalls.length === 0) {
        return;
      }
      const playersToUpdateState = players.filter(
        (x) =>
          x.state === "MOVING" && stillBalls.some((b) => x.key === b.playerKey)
      );
      if (playersToUpdateState.length === 0) {
        return;
      }
      const newPlayerState = players.map((player, index) => {
        if (playersToUpdateState.some((x) => x.key === player.key)) {
          return {
            ...player,
            state: "STILL",
            distance: util.getDistanceYards(
              canvasWidth,
              balls[player.ballIndex].interpolatedPosition[0]
            ),
            //TODO här ska vi kanske räkna distance mellan boll och högerväggen
          };
        }
        return player;
      });
      this.syncPlayersToFirebase(newPlayerState);
    });
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  ensurePlayersInBounds() {
    //TODO den här ska inte behövas. högerkant ska vi ha en fysisk vägg så ingen beräkning behövs.
    //TODO i vänsterkant däremot behövs något som det här faktiskt? så kanske behåll denna metod för att koll när man dör

    //TODO när man är utanför till vänster och åker ut så lägg till spelaren i state.leaderboard med antal spelare kvar som sin position.
    const { balls, canvasWidth, level } = this.state;
    const ensuredBalls = balls.map((ball) => {
      const result = ball;
      if (
        ball.interpolatedPosition[0] < 0 ||
        ball.interpolatedPosition[0] > canvasWidth
      ) {
        result.dead = true;
      }
      return result;
    });

    this.setState(() => ({
      balls: ensuredBalls,
    }));
  }

  drawBalls() {
    const { balls, canvasHeight } = this.state;
    const { game } = this.props;
    const players = Object.values(game.players);

    const len = players.length;
    for (let i = 0; i < len; i++) {
      const player = players[i];
      const pos = balls[player.ballIndex].interpolatedPosition;
      drawBall(
        pos[0],
        pos[1],
        "gray",
        player.color,
        player.ballIndex,
        player.state,
        player.showNameTag,
        player.name,
        canvasHeight
      );
    }
  }

  drawGround() {
    //TODO för race så räcker det kanske med att uppdater så att points är rätt? så kommer de alltid ritas bra här.
    //TODO behöver bara se till att points som försvinner till vänster tas bort och vi lägger till nya points till höger dynamiskt
    //TODO kan det blir problem med scroll i webläsaren?
    const { level, canvasHeight, canvasWidth } = this.state;
    const { points } = level;

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

  drawPlayHud() {
    //TODO denna kanske inte behövs, eller kan skrivas om. En timer bara kanske. som visar vilken nivå (speed) vi är på
    //TODO och en timer som räknar ner för när nästa nivå kommer.
    const { expTime, canvasWidth } = this.state;
    const { game } = this.props;
    ctx.font = "24px roboto";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Level 1. next level in 24s`, 15, 24);
    ctx.font = "20px roboto";
    ctx.textAlign = "right";
    ctx.fillText(`pin: ${game.gameId}`, canvasWidth - 30, 24);
    ctx.textAlign = "left";

    const timeRemaining = Math.floor((expTime - Date.now()) / 1000);
    //TODO gör någon ljudeffekt för när nästa nivå kommer
    // if (timeRemaining === 10) {
    //   soundEffects.countdown.audio.play();
    // }
  }

  testSwing() {
    const { testacceleration, testClubIndex, testBallIndex } = this.state;
    const club = CLUBS[testClubIndex];
    const swing = util.getSwingData(club, testacceleration);
    this.swing(swing, testBallIndex, true);
  }

  swing(velocity, ballIndex, test) {
    const { balls, soundEffects } = this.state;
    const {
      game: { players },
    } = this.props;
    const clubtype = util.identifyClubType(velocity);
    const power = velocity.x + velocity.y;
    const soundEffect = soundEffects[clubtype].find((x) => power > x.minpower);
    // ljudet borde styras mer av var på banan jag slår. spawn så är det en ren smäll. utanför spawn så är det lite mer "gräsljud"?
    // iron och wood blir samma. wood ska jag inte kunna välja utanför spawn?
    if (soundEffect) {
      soundEffect.audio.currentTime = 0;
      soundEffect.audio.play();
    }

    const ballToHit = balls.find((b) => b.ballIndex === ballIndex);
    players[ballToHit.playerKey].state = "MOVING";
    players[ballToHit.playerKey].showNameTag = false;

    const velocityWithDirection = { ...velocity, y: -velocity.y };

    this.syncPlayersObjectToFirebase(players);
    ballToHit.velocity[0] = velocityWithDirection.x;
    ballToHit.velocity[1] = velocityWithDirection.y;
    ballToHit.strokes += 1;
    ballToHit.lastPos = [...ballToHit.position];
    this.setState(() => ({ balls }));
  }

  init() {
    const { game } = this.props;
    const { canvasHeight, canvasWidth } = this.state;
    canvas = document.getElementById("golfcanvas");
    ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;

    //TODO det jag behöver göra nu:
    //1. lägg till en svag förflyttning av hela ground. antar att det är x value på alla level.points jag vill ändra? och då ritas det rätt?
    //  är det minst en px som måste flyttas? pixel per sekund ärdet som vi vill definera. och i render så får vi kolla hur mycket de ska flyttas?
    // vad är fpsen? 60?
    //2. behöver ha en sensor eller något som kollar när biten längst till höger komm in på kartan så ska jag lägga till en till ny point till höger så det alltid finns minst en extra bit till höger.
    //3. kan också städa bort points till vänster när de går utanför skärmen på liknande sätt.
    //4. lägg till en osynlig(?) som ligger precis i högerkanten och som bollen kan studsa i som vanlig groundmaterial. den ska vara sjukt hög. och inte röra på sig med ground utan fast.
    //5. lägg till timer som ökar på speeden på intervaller. kolla lite på hur vi gjorde med timer på vanliga golfen.
    //6. lägg till system med att man dör när man ramlar ut till vänster och vinnaren är den som är kvar längst. leaderboard fixa.
    //7. kolla att replay funkar smidigt så man kan spela flera gånger.
    //8. lägg till coins och poweups... se taiga
    const level = util.levelGen(canvasWidth, canvasHeight, false);
    const world = util.createWorld();

    const groundBodies = util.createGround(level);

    for (const body of groundBodies) {
      world.addBody(body);
    }

    const playerKeys = Object.keys(game.players);
    const len = playerKeys.length;
    const createdPlayers = [];
    const balls = [];
    const playerColors = util.getPlayerColors(len);
    for (let i = 0; i < len; i++) {
      const ball = util.createBall(level.spawn, true);
      // hur håller jag koll på vilken boll som är vilken spelare?
      ball.playerKey = playerKeys[i];
      ball.ballIndex = i;
      ball.strokes = 0;
      ball.dead = false;
      ball.lastPos = [...ball.position];
      world.addBody(ball);
      const player = Object.assign(
        {
          ballIndex: i,
          key: playerKeys[i],
          color: playerColors[i],
          state: "STILL",
          distance: util.getDistanceYards(canvasWidth, level.spawn[0]),
          showNameTag: false,
        },
        game.players[playerKeys[i]]
      );
      balls.push(ball);
      createdPlayers.push(player);
    }
    //

    this.setState(() => ({
      world,
      level,
      balls,
      startTime: Date.now(),
      expTime: Date.now() + level.time,
    }));

    createdPlayers.forEach((player) => this.initControllerListener(player));

    this.setEventHandlers(world);

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
    this.saveGame(game);
  }

  syncPlayersObjectToFirebase(playersObj) {
    const { game, gameFunc } = this.props;
    game.players = playersObj;

    this.saveGame(game);
  }

  syncToFirebase(players, level) {
    const { game, gameFunc } = this.props;

    game.players = players.reduce((_result, player) => {
      const result = _result;
      result[player.key] = player;
      return result;
    }, game.players);
    game.status = "IN_PROGRESS";
    game.minigame.levelColor = level.color;
    this.saveGame(game);
  }

  saveGame(game) {
    const { gameFunc } = this.props;
    gameFunc.update(game);
  }

  nextPhase() {
    const { game } = this.props;
    const { soundEffects, leaderboard } = this.state;
    //TODO flera rundor eller gå direkt till final_result med en replayknapp.
    //TODO få till leaderboard på något vis.
    game.minigame.leaderboard = leaderboard.map((x) => ({
      ...x,
    }));
    game.phase = "final_result";
    this.saveGame(game);
  }

  animate(time) {
    const { world } = this.state;
    const {
      game: { phase },
    } = this.props;
    requestAnimationFrame(this.animate);

    const deltaTime = lastTime ? (time - lastTime) / 400 : 0;

    // Move bodies forward in time

    world.step(fixedTimeStep, deltaTime, maxSubSteps);
    lastTime = time;

    if (phase === "gameplay") {
      this.ensurePlayersInBounds();
      this.renderFrame();
      this.drawPlayHud();
      if (this.isLevelCompleted()) {
        this.nextPhase();
      }
    }
    //  else if (phase === "level_completed") {
    //   this.renderFrame();
    //   this.drawLevelCompleteHud();
    //   if (this.isLoadNextLevel()) {
    //     this.loadNextLevel();
    //   }
    // }
  }

  initControllerListener(player) {
    const { game } = this.props;
    const { balls } = this.state;
    const swingRef = fireGolf
      .database()
      .ref(`/games/${game.key}/players/${player.key}/swing`);

    const that = this;
    swingRef.on("value", (snapshot) => {
      const { game: _game } = that.props;
      const currentPlayer = _game.players[player.key];
      const swingData = snapshot.val();
      if (swingData) {
        that.swing(swingData, currentPlayer.ballIndex);
      } else {
        console.log("move error");
      }
    });

    const findMyBallRef = fireGolf
      .database()
      .ref(`/games/${game.key}/players/${player.key}/showNameTag`);

    findMyBallRef.on("value", (snapshot) => {
      const { game: _game } = that.props;
      const currentPlayer = _game.players[player.key];
      const findData = snapshot.val();

      if (findData) {
        currentPlayer.showNameTag = true;
        // this.setState(() => ({ balls })); kanske behöver trigga denna?
      } else {
        currentPlayer.showNameTag = false;

        console.log("findmyball error");
      }
    });
  }

  isLevelCompleted() {
    //TODO kolla om spelet är klart, dvs bara en levande boll kvar.
    const { expTime, balls } = this.state;
    const now = Date.now();

    //TODO nu kan sista spelaren spela vidare om den vill..
    if (balls.every((b) => b.dead)) {
      return true;
    }

    return false;
  }

  renderFrame() {
    const { canvasHeight, canvasWidth } = this.state;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Transform the canvas
    // Note that we need to flip the y axis since Canvas pixel coordinates
    // goes from top to bottom, while physics does the opposite.
    ctx.save();

    this.drawGround();
    this.drawBalls();
  }

  render() {
    const {
      canvasHeight,
      canvasWidth,
      testClubIndex,
      testacceleration,
      testBallIndex,
      balls,
    } = this.state;
    return (
      <div className="phase-container" id="golfboard">
        <canvas id="golfcanvas" height={canvasHeight} width={canvasWidth} />
        <button type="button" onClick={this.testSwing}>
          swing
        </button>
        <FormControl>
          <InputLabel htmlFor="clubc-required">Club</InputLabel>
          <Select
            value={testClubIndex || 0}
            onChange={this.handleChangeSelect}
            name="testClubIndex"
            inputProps={{
              id: "club-required",
            }}
          >
            {CLUBS.map((c, index) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Acceleration"
          name="testacceleration"
          type="number"
          value={testacceleration}
          margin="normal"
          onChange={this.handleChange("testacceleration")}
        />
        {balls && (
          <FormControl>
            <InputLabel htmlFor="ball-required">Ball</InputLabel>
            <Select
              value={testBallIndex || 0}
              onChange={this.handleChangeSelect}
              name="testBallIndex"
              inputProps={{
                id: "ball-required",
              }}
            >
              {balls.map((b, index) => (
                <MenuItem key={b.ballIndex} value={b.ballIndex}>
                  {b.ballIndex}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    );
  }
}
GolfRace.propTypes = {
  gameFunc: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};
export default GolfRace;
