import React, { Component, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { fire } from '../../../base';
import * as util from './GolfUtil';
import {
  MAX_POWER,
  MIN_POWER,
  PLAYER_COLORS,
} from './GolfConstants';

let c;
let ctx;

function clearCanvas() {
  ctx.clearRect(0, 0, c.width, c.height);
}

class GolfController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highestAcceleration: 0,
      isSwinging: false,
      swingData: [],
      loftAngle: 60,
    };
    this.drawSwing = this.drawSwing.bind(this);
    this.saveSwing = this.saveSwing.bind(this);
  }

  componentDidMount() {
    c = document.getElementById('swingcanvas');
    ctx = c.getContext('2d');
    const that = this;
    window.addEventListener('touchstart', (e) => {
      that.setState(() => {
        const highestAcceleration = 0;
        const swingData = [];
        const isSwinging = true;
        return { highestAcceleration, swingData, isSwinging };
      });
      clearCanvas();
      // e.preventDefault();
    }, false);

    window.addEventListener('touchend', (e) => {
      const { swingData } = that.state;
      that.setState(() => {
        const isSwinging = false;
        return { isSwinging };
      });
      this.drawSwing(swingData);
      this.saveSwing();
      // e.preventDefault();
    }, false);

    window.addEventListener('devicemotion', (event) => {
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
  }

  saveSwing() {
    const { playerKey, game } = this.props;
    const {
      isSwinging, swingData, highestAcceleration, loftAngle,
    } = this.state;
    const currentPlayer = game.players[playerKey];
    if (currentPlayer.state !== 'STILL') {
      alert('ball is not still');
      return;
    }

    if (util.isInvalidSwing(swingData)) {
      alert('invalid swing');
      return;
    }

    const xFactor = (90 - loftAngle) / 90;
    const YFactor = loftAngle / 90;

    const swing = {
      x: Math.min(Math.round(highestAcceleration * xFactor) * 2, MAX_POWER),
      y: Math.min(Math.round(highestAcceleration * YFactor) * 2, MAX_POWER),
      strokes: currentPlayer.swing.strokes + 1,
    };


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
    const prevSwing = { y: 100, x: 100 };
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

  // man ska kunna swinga hela tiden men det är bara när player.state är 'STILL' som en boll rendreras och swingen kan sparas.
  // lägg till en selectbox där man väljer klubba som står loftAngle.
  render() {
    const { game, playerKey } = this.props;
    const { highestAcceleration, isSwinging } = this.state;
    const currentPlayer = game.players[playerKey];
    return (
      <div className="phase-container">
        <div className="player-controlls-container" style={currentPlayer.state === 'STILL' ? { backgroundColor: 'green' } : {}}>
          <Typography variant="h2">club: driver</Typography>
          <canvas id="swingcanvas" height="400" width="320" />
          <Typography variant="h2">{highestAcceleration}</Typography>
        </div>
      </div>
    );
  }
}
GolfController.propTypes = {
  playerKey: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
};
export default GolfController;
