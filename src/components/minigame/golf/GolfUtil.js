import { sample } from 'lodash';
import * as I from 'immutable';
import * as p2 from 'p2';
import {
  WIDTH, HEIGHT, HOLE_HEIGHT,
  HOLE_CURVE_DEPTH,
  HOLE_WIDTH,
  BALL_RADIUS,
} from './GolfConstants';

const colors = [
  'yellow',
  'pink',
  'limegreen',
  'skyblue',
  'orange',
  'red',
  'white',
];
/* get an int between min and max inclusive */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(a) {
  for (let i = a.length; i; i -= 1) {
    const j = Math.floor(Math.random() * i);
    const x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

const ballMaterial = new p2.Material();

const groundMaterial = new p2.Material();

const holeMaterial = new p2.Material();

const ballGroundContact = new p2.ContactMaterial(ballMaterial, groundMaterial, {
  friction: 1,
  restitution: 0.5,
});

const ballHoleContact = new p2.ContactMaterial(ballMaterial, holeMaterial, {
  friction: 1,
  restitution: 0.3,
});

const BALL_GROUP = Math.pow(2, 1);
const GROUND_GROUP = Math.pow(2, 2);

export function createWorld() {
  const world = new p2.World({
    gravity: [0, 50],
  });

  world.sleepMode = p2.World.BODY_SLEEPING;

  world.addContactMaterial(ballGroundContact);
  world.addContactMaterial(ballHoleContact);

  return world;
}

export function isInvalidSwing(swingData) {
  // validerar att swingen måste ha minst x antal datapunkter, vilket säkerställer att det inte var en kort snärt bara.
  if (swingData.length < 10) {
    return true;
  }
  return false;
}
/*
 * Resets the ball position to level spawn if ball fell off world.
 */
export function ensureBallInBounds(body, level) {
  if (body.interpolatedPosition[1] > HEIGHT + 20) {
    body.position = [level.spawn[0], level.spawn[1] - BALL_RADIUS];
    body.velocity = [0, 0];
  }
}

function newBall(position) {
  const ballShape = new p2.Circle({
    radius: BALL_RADIUS,
    collisionGroup: BALL_GROUP,
    collisionMask: GROUND_GROUP,
  });
  ballShape.material = ballMaterial;

  const ballBody = new p2.Body({
    mass: 1,
    position,
  });
  ballBody.addShape(ballShape);

  ballBody.angularDamping = 0.8;
  ballBody.sleepTimeLimit = 1;
  ballBody.sleepSpeedLimit = 2;

  return ballBody;
}
// spawn: I.List<number>
export function createBall(spawn) {
  return newBall([
    spawn[0],
    spawn[1] - BALL_RADIUS,
  ]);
}

export function createBallFromInitial(position, velocity) {
  const ball = newBall(position);
  ball.velocity = velocity.slice(); // clone
  return ball;
}

export function addHolePoints(level) {
  // points has to start with x=0 and end with x=WIDTH
  if (level.points[0][0] !== 0) {
    throw new Error('invalid points: first x !== 0');
  }
  if (level.points[level.points.length - 1][0] !== WIDTH) {
    throw new Error(`invalid points: last x !== WIDTH (${WIDTH})`);
  }

  // insert hole
  // get the first point after the hole...
  const idxAfterHole = level.points.findIndex(point => point[0] > level.hole[0]);
  // const idxAfterHole = level.points.findIndex(point => point.get(0) > level.hole.get(0));

  const x1 = level.hole[0] - HOLE_WIDTH / 2;
  const x2 = level.hole[0] + HOLE_WIDTH / 2;

  if (x1 <= level.points[idxAfterHole - 1][0]) {
    throw new Error('invalid points: hole x1 cannot be <= the previous x');
  }

  if (x2 >= level.points[idxAfterHole][0]) {
    throw new Error('invalid points: hole x2 cannot be >= the previous x');
  }

  // ...then insert hole between points
  const holePoints = [
    [level.hole[0] - HOLE_WIDTH / 2, level.hole[1]],
    [level.hole[0] - HOLE_WIDTH / 2, level.hole[1] + HOLE_CURVE_DEPTH],
    [level.hole[0], level.hole[1] + HOLE_HEIGHT],
    [level.hole[0] + HOLE_WIDTH / 2, level.hole[1] + HOLE_CURVE_DEPTH],
    [level.hole[0] + HOLE_WIDTH / 2, level.hole[1]],
  ];

  const pointsWithHole = level.points
    .slice(0, idxAfterHole)
    .concat(holePoints)
    .concat(level.points.slice(idxAfterHole));
  const levelWithHolePoints = { ...level, points: pointsWithHole };
  return levelWithHolePoints;
}

export function createGround(level) {
  // This used to create a single ground shape.
  // Now it creates 3 because this mysteriously fixes a bug where the ground after the hole wasn't
  // working correctly? man I don't even know
  const beforeHole = level.points.filter(point => point[0] < level.hole[0]);
  const afterHole = level.points.filter(point => point[0] > level.hole[0]);

  const vertsBeforeHole = beforeHole.concat([
    [beforeHole[beforeHole.length - 1][0], HEIGHT],
    [0, HEIGHT],
  ]);

  // Creates this shape:
  // |\/|
  // |  |
  // |  |
  // |__|
  const vertsHole = [
    [level.hole[0] - HOLE_WIDTH / 2, level.hole[1] + HOLE_CURVE_DEPTH],
    [level.hole[0], level.hole[1] + HOLE_HEIGHT],
    [level.hole[0] + HOLE_WIDTH / 2, level.hole[1] + HOLE_CURVE_DEPTH],
    [level.hole[0] + HOLE_WIDTH / 2, HEIGHT],
    [level.hole[0] - HOLE_WIDTH / 2, HEIGHT],
  ];

  const vertsAfterHole = afterHole.concat([
    [WIDTH, HEIGHT],
    [afterHole[0][0], HEIGHT],
  ]);

  const grounds = [vertsBeforeHole, vertsHole, vertsAfterHole].map((verts) => {
    const body = new p2.Body({
      mass: 0,
    });

    body.fromPolygon(verts);

    for (const shape of body.shapes) {
      if (verts === vertsHole) {
        shape.material = holeMaterial;
      } else {
        shape.material = groundMaterial;
      }

      shape.collisionGroup = GROUND_GROUP;
      shape.collisionMask = BALL_GROUP;
    }

    return body;
  });

  return grounds;
}
// pos: I.List<number>
export function createHoleSensor(pos) {
  const sensorShape = new p2.Box({
    width: HOLE_WIDTH,
    height: HOLE_HEIGHT,
  });

  sensorShape.sensor = true;
  sensorShape.collisionGroup = GROUND_GROUP;
  sensorShape.collisionMask = BALL_GROUP;

  // Sensor is purposely built halfway into the ground so top edge collisions are avoided
  const sensorBody = new p2.Body({
    position: [
      pos[0],
      pos[1] + HOLE_HEIGHT,
    ],
  });
  sensorBody.damping = 0;
  sensorBody.addShape(sensorShape);

  return sensorBody;
}

export function getSegmentWidths(totalWidth, minWidth) {
  const widths = [];
  let remainingWidth = totalWidth;

  while (remainingWidth > 0) {
    let maxWidth = 50;

    if (remainingWidth < maxWidth) {
      maxWidth = remainingWidth;
    }

    let width = randInt(minWidth, maxWidth);

    // if this segment would leave us with < minWidth remaining width, just make this segment the
    // entire remaining width
    if (remainingWidth - width < minWidth) {
      width = remainingWidth;
    }

    widths.push(width);
    remainingWidth -= width;
  }

  // shuffle widths so it's not biased towards having smaller segments at the end
  shuffle(widths);

  return widths;
}
export function levelGen(test) {
  if (test) {
    const testLevel = {
      points: [
        [0, 200],
        [WIDTH, 200],
      ],
      hole: [100, 200],
      spawn: [50, 200],
      color: 'white',
    };
    return testLevel;
  }

  const segmentWidths = getSegmentWidths(WIDTH, 12);
  const numSegments = segmentWidths.length;

  const spawnSegment = randInt(1, Math.floor(numSegments / 3));
  const holeSegment = numSegments - randInt(1, Math.floor(numSegments / 3));

  const points = [];
  let spawnX;
  let spawnY;
  let holeX;
  let holeY;

  const minY = 80;
  const maxY = 250;

  for (let idx = 0; idx <= numSegments; idx++) {
    const segmentWidth = segmentWidths[idx - 1];

    let x; let
      y;

    if (idx === 0) {
      x = 0;
    } else {
      x = points[idx - 1][0] + segmentWidth;
    }

    if (x > WIDTH) {
      x = WIDTH;
    }

    if (idx === 0) {
      y = randInt(HEIGHT - 150, HEIGHT - 20);
    } else {
      const prevY = points[idx - 1][1];

      // special-case flat section
      if (randInt(1, 3) === 1) {
        y = prevY;
      } else {
        let boundLow = prevY - 40;
        let boundHigh = prevY + 40;

        // clamp high/low bounds so that if they go out of screen bounds, the bounds shift to
        // contain the same range but clamped
        if (boundLow < minY) {
          boundHigh -= (boundLow - minY);
          boundLow = minY;
        }

        if (boundHigh > maxY) {
          boundLow -= (boundHigh - maxY);
          boundHigh = maxY;
        }

        y = randInt(boundLow, boundHigh);
      }
    }

    if (idx === spawnSegment) {
      spawnX = x - Math.round(segmentWidth / 2);
      y = points[idx - 1][1];
      spawnY = y;
    }

    if (idx === holeSegment) {
      holeX = x - Math.round(segmentWidth / 2);
      y = points[idx - 1][1];
      holeY = y;
    }

    points.push([x, y]);
  }

  const color = sample(colors);

  const hole = [holeX, holeY];
  const spawn = [spawnX, spawnY];

  const level = {
    points,
    hole,
    spawn,
    color,
  };

  return level;
}
