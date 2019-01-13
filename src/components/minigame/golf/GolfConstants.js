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


export const PHYSICS_SPEED_FACTOR = 3;

export const CLUBS = [
  {
    name: 'Wood', id: 0, loft: 22, powerFactor: 3.4, max: 800,
  },
  {
    name: 'Hybrid', id: 1, loft: 26, powerFactor: 3.2, max: 800,
  },
  {
    name: '3 Iron', id: 2, loft: 31, powerFactor: 2.8, max: 700,
  },
  {
    name: '4 Iron', id: 3, loft: 34, powerFactor: 2.75, max: 700,
  },
  {
    name: '5 Iron', id: 4, loft: 37, powerFactor: 2.7, max: 700,
  },
  {
    name: '6 Iron', id: 5, loft: 40, powerFactor: 2.65, max: 700,
  },
  {
    name: '7 Iron', id: 6, loft: 43, powerFactor: 2.6, max: 700,
  },
  {
    name: '8 Iron', id: 7, loft: 46, powerFactor: 2.55, max: 700,
  },
  {
    name: '9 Iron', id: 8, loft: 49, powerFactor: 2.5, max: 700,
  },
  {
    name: 'Wedge', id: 9, loft: 62, powerFactor: 2.4, max: 700,
  },
  {
    name: 'Chipper', id: 10, loft: 78, powerFactor: 2.3, max: 700,
  },
  {
    name: 'Putter', id: 11, loft: 1, powerFactor: 1.5, max: 500,
  },
];

export const GROUND_COLORS = [
  'orange',
  'brown',
  'gray',
];

// thx friends
export const goalWords = [
  'touchdown',
  'nothing but net',
  'gooooooooal',
  'it\'s good',
  'you dunked',
  'nice dunk',
  'mmmmmonster dunk',
  'home run',
  'you defeated',
  'point get', // gnu order
  'perfect score', // gnu order
  'goat bonus', // robiben
  'you\'re great', // gnu order
  'your winner', // robiben
  'ball bonus', // robiben
  'perfect putt', // gnu order
  'big gulp', // robiben
  'nice one, senpai', // cat doter
  'a winner is you', // AlucardRD
  'come putt, milord', // cat doter
  '30 - love', // oatgan
  'nice on', // cronox2
  'chase the snowman', // big jeffrey
  'what a season',
  'from downtown',
  'you\'re on fire',
  'dunk it good', // theme song to space jam 2
];
