import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

let canvas;
let context;
let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let first = true;
const mousePos = {
  x: 400,
  y: 300,
};
let particles = [];
let rockets = [];
const MAX_PARTICLES = 400;
const colorCode = 0;
const img = new Image();
img.src = 'https://www.golfworldtravel.se/wp-content/uploads/2013/12/Arabella-Sheraton-Golf-4.jpg';


function loop() {
  // update screen size
  if (SCREEN_WIDTH != window.innerWidth) {
    canvas.width = SCREEN_WIDTH = window.innerWidth;
  }
  if (SCREEN_HEIGHT != window.innerHeight) {
    canvas.height = SCREEN_HEIGHT = window.innerHeight;
  }

  context.save();
  if (first) {
    first = false;
    context.globalAlpha = 1;
  } else {
    context.globalAlpha = 0.2;
  }
  context.drawImage(img, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  context.restore();


  // clear canvas
  // context.fillStyle = "rgba(0, 0, 0, 0.05)";
  // context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  const existingRockets = [];

  for (let i = 0; i < rockets.length; i++) {
    // update and render
    rockets[i].update();
    rockets[i].render(context);

    // calculate distance with Pythagoras
    const distance = Math.sqrt(Math.pow(mousePos.x - rockets[i].pos.x, 2) + Math.pow(mousePos.y - rockets[i].pos.y, 2));

    // random chance of 1% if rockets is above the middle
    const randomChance = rockets[i].pos.y < (SCREEN_HEIGHT * 2 / 3) ? (Math.random() * 100 <= 1) : false;

    /* Explosion rules
           - 80% of screen
          - going down
          - close to the mouse
          - 1% chance of random explosion
      */
    if (rockets[i].pos.y < SCREEN_HEIGHT / 5 || rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
      rockets[i].explode();
    } else {
      existingRockets.push(rockets[i]);
    }
  }

  rockets = existingRockets;

  const existingParticles = [];

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();

    // render and save particles that can be rendered
    if (particles[i].exists()) {
      particles[i].render(context);
      existingParticles.push(particles[i]);
    }
  }

  // update array with existing particles - old particles should be garbage collected
  particles = existingParticles;

  while (particles.length > MAX_PARTICLES) {
    particles.shift();
  }
}

function Particle(pos) {
  this.pos = {
    x: pos ? pos.x : 0,
    y: pos ? pos.y : 0,
  };
  this.vel = {
    x: 0,
    y: 0,
  };
  this.shrink = 0.97;
  this.size = 2;

  this.resistance = 1;
  this.gravity = 0;

  this.flick = false;

  this.alpha = 1;
  this.fade = 0;
  this.color = 0;
}

Particle.prototype.update = function () {
  // apply resistance
  this.vel.x *= this.resistance;
  this.vel.y *= this.resistance;

  // gravity down
  this.vel.y += this.gravity;

  // update position based on speed
  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y;

  // shrink
  this.size *= this.shrink;

  // fade out
  this.alpha -= this.fade;
};

Particle.prototype.render = function (c) {
  if (!this.exists()) {
    return;
  }

  c.save();

  c.globalCompositeOperation = 'lighter';

  const x = this.pos.x;


  const y = this.pos.y;


  const r = this.size / 2;

  const gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
  gradient.addColorStop(0.1, `rgba(255,255,255,${this.alpha})`);
  gradient.addColorStop(0.8, `hsla(${this.color}, 100%, 50%, ${this.alpha})`);
  gradient.addColorStop(1, `hsla(${this.color}, 100%, 50%, 0.1)`);

  c.fillStyle = gradient;

  c.beginPath();
  c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
  c.closePath();
  c.fill();

  c.restore();
};

Particle.prototype.exists = function () {
  return this.alpha >= 0.1 && this.size >= 1;
};

function Rocket(x) {
  Particle.apply(this, [{
    x,
    y: SCREEN_HEIGHT,
  }]);

  this.explosionColor = 0;
}

Rocket.prototype = new Particle();
Rocket.prototype.constructor = Rocket;

Rocket.prototype.explode = function () {
  const count = Math.random() * 10 + 80;

  for (let i = 0; i < count; i++) {
    const particle = new Particle(this.pos);
    const angle = Math.random() * Math.PI * 2;

    // emulate 3D effect by using cosine and put more particles in the middle
    const speed = Math.cos(Math.random() * Math.PI / 2) * 15;

    particle.vel.x = Math.cos(angle) * speed;
    particle.vel.y = Math.sin(angle) * speed;

    particle.size = 10;

    particle.gravity = 0.2;
    particle.resistance = 0.92;
    particle.shrink = Math.random() * 0.05 + 0.93;

    particle.flick = true;
    particle.color = this.explosionColor;

    particles.push(particle);
  }
};

Rocket.prototype.render = function (c) {
  if (!this.exists()) {
    return;
  }

  c.save();

  c.globalCompositeOperation = 'lighter';

  const x = this.pos.x;


  const y = this.pos.y;


  const r = this.size / 2;

  const gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
  gradient.addColorStop(0.1, `rgba(255, 255, 255 ,${this.alpha})`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${this.alpha})`);

  c.fillStyle = gradient;

  c.beginPath();
  c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
  c.closePath();
  c.fill();

  c.restore();
};
function launch() {
  launchFrom(mousePos.x);
}
function launchFrom(x) {
  if (rockets.length < 10) {
    const rocket = new Rocket(x);
    rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
    rocket.vel.y = Math.random() * -3 - 4;
    rocket.vel.x = Math.random() * 6 - 3;
    rocket.size = 8;
    rocket.shrink = 0.999;
    rocket.gravity = 0.01;
    rockets.push(rocket);
  }
}
class PhaseFinalResult extends Component {
  constructor(props) {
    super(props);
    this.replayGame = this.replayGame.bind(this);
  }

  componentDidMount() {
    canvas = document.getElementById('fireworkscanvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setInterval(launch, 800);
    setInterval(loop, 1000 / 50);
  }

  replayGame() {
    const { gameFunc } = this.props;
    gameFunc.update({ phase: 'starting' });
  }

  /*
skriv ut vinnaren och hur lång tid gamet tog
(använd minigame.ticks och minigame.difficulty för att räkna ut sekunder)
minigame.winners inner håller vinnare/vinnarna.
kan vara så att winners inte finns om det snakes.length === 1
 men då är ju den "vinnaren". typ i coop singelplayer
podium
  */
  render() {
    const { gameFunc, game } = this.props;
    const cheight = canvas ? canvas.height : window.innerHeight;
    const cWidth = canvas ? canvas.width : window.innerWidth;

    const winner = game.players[game.minigame.leaderboard[0].playerKey];
    const winnerScore = game.minigame.leaderboard[0].totalScore;
    return (
      <div className="phase-container">
        <canvas id="fireworkscanvas" />
        <div style={{
          position: 'absolute', top: 0, marginTop: cheight / 2, marginLeft: cWidth / 2,
        }}
        >
          <Typography variant="h2" style={{ color: 'white' }}>{`${winner.name} vinner med ${winnerScore} poäng`}</Typography>
        </div>
        <div style={{ position: 'absolute', top: 0, marginTop: cheight }}>
          <div>
            <Button onClick={this.replayGame}>Replay game</Button>
            <Button onClick={gameFunc.restart}>Re-host game</Button>
            <Button onClick={gameFunc.quit}>Quit game</Button>
            <Button onClick={() => alert('show results')}>Show results</Button>
            <Button onClick={() => alert('start survey')}>Start survey</Button>
            <Button>
              <Link to="/create">Create new game</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
PhaseFinalResult.propTypes = {
  game: PropTypes.object.isRequired,
  gameFunc: PropTypes.object.isRequired,
};
export default PhaseFinalResult;
