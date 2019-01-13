import { sample } from 'lodash';
import tinycolor from 'tinycolor2';
import * as p2 from 'p2';
import {
  HOLE_HEIGHT,
  HOLE_CURVE_DEPTH,
  HOLE_WIDTH,
  GROUND_COLORS,
  BALL_RADIUS,
} from './GolfConstants';

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
  ballBody.damping = 0.18;
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
export function getDistanceYards(a, b) {
  if (a > b) {
    return Math.floor((a - b) / 4);
  }
  return Math.floor((b - a) / 4);
}

export function createBallFromInitial(position, velocity) {
  const ball = newBall(position);
  ball.velocity = velocity.slice(); // clone
  return ball;
}
export function getSwingData(club, acceleration) {
  const xFactor = (90 - club.loft) / 90;
  const YFactor = club.loft / 90;
  // en lös putt kommer fortfarande registreras som 0.14 etc. kanske ska lägga på en mini så att highestAcceleration alltid är minst 5?
  // lägger alltså på gratis 5 på highest acc. eller så får jag räkna om värdet på den så att de första upp till 10 räknas som mer värda ellerså?
  const power = acceleration;
  // kör testleveln. kolla på angulardampening? kanske är det som är problemet. får ju ingen lyft på bollarna. öka faktorerna. öka y?
  const swing = {
    x: Math.min(Math.ceil(power * xFactor) * club.powerFactor, club.max),
    y: Math.min(Math.ceil(power * YFactor) * club.powerFactor, club.max),
  };
  return swing;
}
export function addHolePoints(level) {
  const { width } = level;

  // points has to start with x=0 and end with x=WIDTH
  if (level.points[0][0] !== 0) {
    throw new Error('invalid points: first x !== 0');
  }
  if (level.points[level.points.length - 1][0] !== width) {
    throw new Error(`invalid points: last x !== WIDTH (${width})`);
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
  const { height, width } = level;
  // This used to create a single ground shape.
  // Now it creates 3 because this mysteriously fixes a bug where the ground after the hole wasn't
  // working correctly? man I don't even know
  const beforeHole = level.points.filter(point => point[0] < level.hole[0]);
  const afterHole = level.points.filter(point => point[0] > level.hole[0]);

  const vertsBeforeHole = beforeHole.concat([
    [beforeHole[beforeHole.length - 1][0], height],
    [0, height],
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
    [level.hole[0] + HOLE_WIDTH / 2, height],
    [level.hole[0] - HOLE_WIDTH / 2, height],
  ];

  const vertsAfterHole = afterHole.concat([
    [width, height],
    [afterHole[0][0], height],
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
      pos[1] + (Math.ceil(HOLE_HEIGHT * 1.4)),
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

export function getPlayerColors(len) {
  const goldenRatio = 0.618033988749895;
  const colors = [];
  const s = 0.5;
  const v = 0.95;
  let h = Math.random();
  for (let i = 0; i < len; i++) {
    h += goldenRatio;
    h %= 1;
    const tiny = tinycolor.fromRatio({ h, s, v });
    colors.push(tiny.toHexString());
  }

  return colors;
}
// lägg till olika material de två segementerna närmast hålet ska vara green, där färgen är anoorlunda och friktionen mindre
// vattenhinder? blått och räknas likt outOfBounds? fast sätt tillbaka till senaste pos, spara alltid senaste pos använd även för outofbounds?
// bunker: hög friktion, ingen studs = damping?
// bunker och vatten kan bara finnas på plant eller i en viaduct, ta nåra av de spetsiga hålen/viaducterna och gör till vatten eller bunker
// bunker och vatten kan påverka par? kan öka paret ett snäpp om det är mycket bunker/vatten
// rough och fairway är samma? tillsvidare
export function levelGen(width, height, test) {
  if (test) {
    const testLevel = {
      points: [
        [0, 400],
        [width, 400],
      ],
      hole: [width / 1.5, 400],
      spawn: [100, 400],
      color: 'brown',
      par: 4,
      height,
      time: 45000,
      width,
    };
    return testLevel;
  }

  const segmentWidths = getSegmentWidths(width, 12);
  const numSegments = segmentWidths.length;

  const spawnSegment = randInt(2, Math.floor(numSegments / 5));
  let par;
  if (width > 1000) {
    const rnd = randInt(1, 18);
    if (rnd > 8) {
      par = 4;
    } else if (rnd > 4) {
      par = 5;
    } else {
      par = 3;
    }
  } else {
    par = 5;
  }
  const asdf = {
    5: [2, Math.floor(numSegments / 4)],
    4: [Math.floor(numSegments / 4), Math.floor(numSegments / 2.5)],
    3: [Math.floor(numSegments / 2.5), Math.floor(numSegments / 2)],
  };
  const holeSegments = {
    5: numSegments - randInt(2, Math.floor(numSegments / 4)),
    4: numSegments - randInt(Math.floor(numSegments / 4), Math.floor(numSegments / 2.5)),
    3: numSegments - randInt(Math.floor(numSegments / 2.5), Math.floor(numSegments / 2)),
  };

  const holeSegment = holeSegments[par];

  const timePars = {
    5: 90 * 1000,
    4: 60 * 1000,
    3: 45 * 1000,
  };

  const time = timePars[par];

  const points = [];
  let spawnX;
  let spawnY;
  let holeX;
  let holeY;

  const minY = height * 0.5;
  const maxY = minY + Math.min(200, height * 0.3);

  for (let idx = 0; idx <= numSegments; idx++) {
    const segmentWidth = segmentWidths[idx - 1];

    let x; let
      y;

    if (idx === 0) {
      x = 0;
    } else {
      x = points[idx - 1][0] + segmentWidth;
    }

    if (x > width) {
      x = width;
    }

    if (idx === 0) {
      y = randInt(height - 150, height - 20);
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

  const color = sample(GROUND_COLORS);

  const hole = [holeX, holeY];
  const spawn = [spawnX, spawnY];

  const level = {
    points,
    hole,
    spawn,
    color,
    par,
    time,
    height,
    width,
  };

  return level;
}
