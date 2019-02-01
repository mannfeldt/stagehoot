export const WIDTH = 500;
export const HEIGHT = 250;

export const HOLE_HEIGHT = 10;
export const HOLE_CURVE_DEPTH = 7;
export const HOLE_WIDTH = 10;
export const BALL_RADIUS = 3;
export const BALL_RADIUS_CONTROLLER = 12;

export const MIN_POWER = 10;
export const MAX_POWER = 150;
export const SWING_STEP = 75;

export const TIMER_MS = 45 * 1000;
export const OVER_TIMER_MS = 7 * 1000;
export const HURRY_UP_MS = 15 * 1000;
export const IDLE_KICK_MS = 60 * 1000;
export const MATCH_LENGTH_MS = 5 * 60 * 1000;
export const MATCH_OVER_MS = 10 * 1000;

export const AIR_COLOR = '#2f2f2f';
export const GRASS_COLOR = 'green';
export const ROUGH_COLOR = 'green';
export const FAIRWAY_COLOR = 'green';
export const GREEN_COLOR = 'green';
export const BUNKER_COLOR = 'green';
export const WATER_COLOR = 'blue';
export const PENALTY_STROKES = 12;


export const PHYSICS_SPEED_FACTOR = 3;

export const SCORE_TERMS = [
  {
    name: 'Albatross', score: -3,
  }, {
    name: 'Eagle', score: -2,
  },
  {
    name: 'Birdie', score: -1,
  },
  {
    name: 'Par', score: 0,
  },
  {
    name: 'Bogey', score: 1,
  },
  {
    name: 'Double bogey', score: 2,
  },
  {
    name: 'Triple bogey', score: 3,
  },
  {
    name: 'Quadruple bogey', score: 4,
  },
];

export const CLUBS = [
  {
    name: 'Wood', type: 'wood', id: 0, loft: 22, powerFactor: 3.8, max: 800,
  },
  {
    name: 'Hybrid', type: 'iron', id: 1, loft: 26, powerFactor: 3.6, max: 800,
  },
  {
    name: '3 Iron', type: 'iron', id: 2, loft: 31, powerFactor: 3.2, max: 700,
  },
  {
    name: '4 Iron', type: 'iron', id: 3, loft: 34, powerFactor: 3.15, max: 700,
  },
  {
    name: '5 Iron', type: 'iron', id: 4, loft: 37, powerFactor: 3.1, max: 700,
  },
  {
    name: '6 Iron', type: 'iron', id: 5, loft: 40, powerFactor: 3.05, max: 700,
  },
  {
    name: '7 Iron', type: 'iron', id: 6, loft: 43, powerFactor: 3, max: 700,
  },
  {
    name: '8 Iron', type: 'iron', id: 7, loft: 46, powerFactor: 2.95, max: 700,
  },
  {
    name: '9 Iron', type: 'iron', id: 8, loft: 49, powerFactor: 2.9, max: 700,
  },
  {
    name: 'Wedge', type: 'iron', id: 9, loft: 62, powerFactor: 2.75, max: 700,
  },
  {
    name: 'Chipper', type: 'iron', id: 10, loft: 78, powerFactor: 2.6, max: 700,
  },
  {
    name: 'Putter', type: 'putt', id: 11, loft: 1, powerFactor: 1.6, max: 400,
  },
];

export const GROUND_COLORS = [
  'orange',
  'brown',
  'gray',
];
