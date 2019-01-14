import React, { Component, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as util from './GolfUtil';
import { fire } from '../../../base';
import './golf.css';
import {
  MAX_POWER,
  MIN_POWER,
  CLUBS,
  BALL_RADIUS,
  AIR_COLOR,
  GRASS_COLOR,
  BALL_RADIUS_CONTROLLER,
  PLAYER_COLORS,
} from './GolfConstants';

const styles = theme => ({
  container: {
    height: '100vh',
    width: '100vw',
  },
  canvas: {
  },
  header: {
    height: 80,
  },
  footer: {
    height: 80,
    marginTop: '-4px',
  },
});

let canvas;
let ctx;

function drawBall(x, y, fill, stroke, playerState) {
  ctx.lineWidth = 1;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS_CONTROLLER, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(x, y, BALL_RADIUS_CONTROLLER - ctx.lineWidth / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}
function drawEnvironment(x, y, groundColor, stroke) {
  ctx.fillStyle = GRASS_COLOR;
  ctx.fillRect(0, y - BALL_RADIUS_CONTROLLER, x, BALL_RADIUS_CONTROLLER);
  // groundcolor längst ner
  // GRASS_COLOR är stroke
  // WITH på
  // AIR_COLOR är överdelen
}
function drawStrokes(x, y, distance) {
  ctx.font = '28px roboto';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText(`Slag: ${distance} yards`, x, y);
}

function drawDistance(x, y, distance) {
  ctx.font = '24px roboto';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText(`Distance: ${distance} yards`, x, 24);
}
function drawScoreText(x, y, player) {
  ctx.font = '22px roboto';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText(`You scored with ${player.swing.strokes} strokes in ${player.scoreTime} seconds`, x, y);
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

class GolfController extends Component {
  constructor(props) {
    super(props);
    // sätt det här till rätt höjd. det ska vara windowheight - header - footer
    const canvasHeight = Math.floor(window.innerHeight - 160);
    const canvasWidth = Math.floor(window.innerWidth);
    this.state = {
      highestAcceleration: 0,
      isSwinging: false,
      swingData: [],
      clubIndex: 0,
      canvasHeight,
      canvasWidth,
    };
    this.drawSwing = this.drawSwing.bind(this);
    this.renderFrame = this.renderFrame.bind(this);
    this.saveSwing = this.saveSwing.bind(this);
  }

  componentDidMount() {
    canvas = document.getElementById('swingcanvas');
    ctx = canvas.getContext('2d');
    ctx.translate(0.5, 0.5);
    const that = this;
    canvas.addEventListener('touchstart', (e) => {
      that.setState(() => {
        const highestAcceleration = 0;
        const swingData = [];
        const isSwinging = true;
        return { highestAcceleration, swingData, isSwinging };
      });
      clearCanvas();
      this.renderFrame();

      // e.preventDefault();
    }, false);

    canvas.addEventListener('touchend', (e) => {
      const { swingData } = that.state;
      that.setState(() => {
        const isSwinging = false;
        return { isSwinging };
      });
      this.renderFrame();
      this.saveSwing();
      // e.preventDefault();
    }, false);


    window.addEventListener('devicemotion', (e) => {
      const event = e || window.event;
      event.preventDefault();
      event.stopPropagation();
      const { isSwinging, swingData, highestAcceleration } = that.state;
      if (isSwinging) {
        const { x, y, z } = event.acceleration;
        swingData.push({ x: Math.round(x * 2), y: Math.round(y * 2), z: Math.round(z * 2) });
        // this.drawSwing([{ x: Math.round(x * 2), y: Math.round(y * 2), z: Math.round(z * 2) }]);
        const power = x + z;
        if (power > highestAcceleration) {
          that.setState(() => ({ highestAcceleration: power, swingData }));
        } else {
          that.setState(() => swingData);
        }
      }
    }, true);
    this.renderFrame();
  }

  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };


  saveSwing() {
    const { playerKey, game } = this.props;
    const {
      isSwinging, swingData, highestAcceleration, clubIndex,
    } = this.state;
    const currentPlayer = game.players[playerKey];
    if (currentPlayer.state !== 'STILL') {
      alert('ball is not still');
      return;
    }
    if (game.phase !== 'gameplay') {
      alert('game is not playing');
      return;
    }

    if (util.isInvalidSwing(swingData)) {
      alert('invalid swing');
      return;
    }
    // ska bara kunna används wood på första slaget? ge det lite extra power
    const club = CLUBS[clubIndex];
    const swing = util.getSwingData(club, highestAcceleration);
    swing.strokes = currentPlayer.swing.strokes + 1;

    // test
    // test


    fire.database().ref(`/games/${game.key}/players/${playerKey}/swing`).set(swing, (error) => {
      if (error) {
        console.log('error updated swing move');
      } else {
        console.log('saved swing success');
      }
    });
  }

  drawSwing() {
    const { swingData } = this.state;
    const len = swingData.length;
    // test om den här. det ska vara hela swingen efter att den är klar som ritas.
    // kolla på drawGround etc. där behöver jag inte loopa beginpath och stroke etc. utan jag har istöället en start pos
    const prevSwing = { y: canvas.height - (BALL_RADIUS_CONTROLLER * 2), x: canvas.width / 2 };
    for (let i = 0; i < len; i++) {
      const newY = prevSwing.y + (Math.round(swingData[i].z));
      const newX = prevSwing.x + (Math.round(swingData[i].y));
      ctx.beginPath();
      ctx.moveTo(prevSwing.x, prevSwing.y);
      ctx.lineTo(newX, newY);
      ctx.stroke();
      prevSwing.y = newY;
      prevSwing.x = newX;
    }
  }

  renderFrame() {
    const { game, playerKey, classes } = this.props;
    const { swingData } = this.state;
    if (!ctx) {
      return;
    }
    const currentPlayer = game.players[playerKey];

    ctx.lineWidth = 4;
    const background = new Image();
    background.src = 'https://i.imgur.com/DE8oR5A.png';

    background.onload = function () {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      if (currentPlayer.state === 'STILL') {
        drawStrokes(canvas.width / 2, canvas.height / 2, currentPlayer.swing.strokes);
        drawBall(canvas.width / 2, canvas.height - (BALL_RADIUS_CONTROLLER * 2), currentPlayer.color, 'gray');
        drawDistance(canvas.width / 2, canvas.height / 2, currentPlayer.distance);
      } else if (currentPlayer.state === 'SCORED') {
        drawScoreText(canvas.width / 2, canvas.height / 2, currentPlayer);
      }
      this.drawSwing(swingData);
      drawEnvironment(canvas.width, canvas.height, game.minigame.levelColor, 'gray');
    };
  }

  // man ska kunna swinga hela tiden men det är bara när player.state är 'STILL' som en boll rendreras och swingen kan sparas.
  // lägg till en selectbox där man väljer klubba som står loftAngle.
  // lägg till en snyggare powermätare. använd någon riktigt visuel mätare
  render() {
    const { game, playerKey, classes } = this.props;
    const {
      highestAcceleration, isSwinging, canvasHeight, canvasWidth, clubIndex,
    } = this.state;
    this.renderFrame();
    return (
      <div className="phase-container">
        <div className={classes.container}>
          <div className={classes.header}>
            <FormControl>
              <InputLabel htmlFor="clubc-required">Club</InputLabel>
              <Select
                value={clubIndex || 0}
                onChange={this.handleChangeSelect}
                name="clubIndex"
                inputProps={{
                  id: 'club-required',
                }}
              >
                {CLUBS.map((c, index) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}

              </Select>
            </FormControl>
          </div>
          <canvas id="swingcanvas" className={classes.canvas} height={canvasHeight} width={canvasWidth} />
          <div className={classes.footer} style={{ backgroundColor: game.minigame.levelColor }}>
            <Typography variant="h2">{highestAcceleration}</Typography>
          </div>
        </div>
      </div>
    );
  }
}
GolfController.propTypes = {
  playerKey: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  classes: PropTypes.any,
};
export default withStyles(styles)(GolfController);
