const gridSize = 20;
function isInvalidMove(keyPress, currentDirection) {
  if (!keyPress) {
    return true;
  }
  const invalidMovment = {
    left: 'right', right: 'left', up: 'down', down: 'up',
  };
  return invalidMovment[keyPress] === currentDirection;
}
function getInitialFoods(amount) {
  const initialFoods = [];
  for (let i = 0; i < amount; i++) {
    const food = {
      active: false,
    };
    initialFoods.push(food);
  }
  return initialFoods;
}
// vissa snakes lyckas inte äta foods? är det en bugg med konstiga synkningar mot state när det är så många?
// det verkar inte heller fungera med positioneringen indexof. Ormarna hamnar ibland precis brevid varandra.
function getSnakesInStartingPosition(snakes, canvasSettings) {
  for (let i = 0, len = snakes.length; i < len; i++) {
    const snake = snakes[i];
    snake.direction = snake.actions[i % 4];
    snake.moves = [];
    let pos;
    switch (snake.direction) {
      case 'right':
        pos = getRandomStartingPosLeft(snakes, canvasSettings.height);
        snake.body = [{
          x: pos.x,
          y: pos.y,
        }, {
          x: pos.x - gridSize,
          y: pos.y,
        }, {
          x: pos.x - (gridSize * 2),
          y: pos.y,
        }, {
          x: pos.x - (gridSize * 3),
          y: pos.y,
        }];
        break;
      case 'left':
        pos = getRandomStartingPosRight(snakes, canvasSettings);
        snake.body = [{
          x: pos.x,
          y: pos.y,
        }, {
          x: pos.x + gridSize,
          y: pos.y,
        }, {
          x: pos.x + (gridSize * 2),
          y: pos.y,
        }, {
          x: pos.x + (gridSize * 3),
          y: pos.y,
        }];
        break;
      case 'up':
        pos = getRandomStartingPosBottom(snakes, canvasSettings);
        snake.body = [{
          x: pos.x,
          y: pos.y,
        }, {
          x: pos.x,
          y: pos.y + gridSize,
        }, {
          x: pos.x,
          y: pos.y + (gridSize * 2),
        }, {
          x: pos.x,
          y: pos.y + (gridSize * 3),
        }];
        break;
      case 'down':
        pos = getRandomStartingPosTop(snakes, canvasSettings.width);
        snake.body = [{
          x: pos.x,
          y: pos.y,
        }, {
          x: pos.x,
          y: pos.y - gridSize,
        }, {
          x: pos.x,
          y: pos.y - (gridSize * 2),
        }, {
          x: pos.x,
          y: pos.y - (gridSize * 3),
        }];
        break;
      default:
        break;
    }
  }

  return snakes;
}

function getRandomStartingPosTop(snakes, canvasWidth) {
  const snakesDown = snakes.filter(s => s.direction === 'down' && s.body);
  const existingValues = [...new Set(snakesDown.map(s => s.body[0].x))];

  const margin = gridSize * 8;
  const xMax = canvasWidth - (margin * 2);
  const y = gridSize * 2;
  const x = getRandomStartingPos(xMax, margin, existingValues);
  return { x, y };
}

function getRandomStartingPosBottom(snakes, canvasSettings) {
  const snakesDown = snakes.filter(s => s.direction === 'up' && s.body);
  const existingValues = [...new Set(snakesDown.map(s => s.body[0].x))];

  const margin = gridSize * 8;
  const xMax = canvasSettings.width - (margin * 2);
  const y = canvasSettings.height - (gridSize * 3);
  const x = getRandomStartingPos(xMax, margin, existingValues);
  return { x, y };
}

function getRandomStartingPosRight(snakes, canvasSettings) {
  const snakesDown = snakes.filter(s => s.direction === 'left' && s.body);
  const existingValues = [...new Set(snakesDown.map(s => s.body[0].y))];

  const margin = gridSize * 8;
  const yMax = canvasSettings.height - (margin * 2);
  const x = canvasSettings.width - (gridSize * 3);
  const y = getRandomStartingPos(yMax, margin, existingValues);
  return { x, y };
}

function getRandomStartingPosLeft(snakes, canvasHeight) {
  const snakesDown = snakes.filter(s => s.direction === 'right' && s.body);
  const existingValues = [...new Set(snakesDown.map(s => s.body[0].y))];

  const margin = gridSize * 8;
  const yMax = canvasHeight - (margin * 2);
  const x = gridSize * 2;
  const y = getRandomStartingPos(yMax, margin, existingValues);
  return { x, y };
}

function getRandomStartingPos(max, margin, existingValues) {
  const value = Math.round((Math.random() * max) / gridSize) * gridSize + margin;
  const posTaken = existingValues.some(v => v === value || v === value - gridSize || v === value + gridSize);

  if (posTaken) {
    return getRandomStartingPos(max, margin, existingValues, gridSize);
  }
  return value;
}
function getRandomCanvasPositionMargin(yMax, xMax) {
  const x = Math.round((Math.random() * (xMax - (gridSize * 14))) / gridSize) * gridSize + (gridSize * 4);
  const y = Math.round((Math.random() * (yMax - (gridSize * 2))) / gridSize) * gridSize + (gridSize * 2);
  return { x, y };
}
// denna function är inte så lätt, kan troligen förenklas
function detectOpponentCollision(snakes, eatOpponents) {
  for (let i = 0, len = snakes.length; i < len; i++) {
    if (snakes[i].dead) {
      // om den redan är död så fortsätt. t.ex. en headon så kör jag båda två till dead direkt.
      continue;
    }
    const currentSnake = snakes[i];
    for (let j = 0; j < len; j++) {
      // om opponents är död så ska man inte kunna krocka med den. döda snakes har ju fortfarande coordinater. alt är att ta bort coordinaterna
      if (j === i || snakes[j].dead) {
        continue;
      }
      const opponentSnake = snakes[j];
      // lägga till en function där om man äter body[1] så där opponent?
      for (let k = 0, len2 = opponentSnake.body.length; k < len2; k++) {
        const collision = opponentSnake.body[k].x === currentSnake.body[0].x && opponentSnake.body[k].y === currentSnake.body[0].y;
        if (collision) {
          if (k === 0) {
            currentSnake.dead = true;
            opponentSnake.dead = true;
            // collision head>head
          } else if (eatOpponents) {
            // snakes
            if (k === 1) {
              opponentSnake.dead = true;
            } else {
              opponentSnake.body.length = k;
              len2 = k;

              // snakes[j].body.length = k;
            }
            // kan jag använda opponentSnakeBody istället för snakes[j].body
            // opponentSnakeBody.length = k;?
          } else {
            currentSnake.dead = true;
          }
        }
      }
    }
  }
  return snakes;
}

function detectSelfCollision(snake) {
  const { body } = snake;
  if (body.length < 5) {
    return false;
  }
  // denna är nog inte lika snabb som for loopen?
  const collision = body.slice(4).some(b => b.x === body[0].x && b.y === body[0].y);
  return collision;
  /*
    for (let i = 4, len = body.length; i < len; i++) {
      const selfCollison = body[i].x === body[0].x && body[i].y === body[0].y;
      if (selfCollison) {
        return true;
      }
    }
    return false;
    */
}

function detectWallCollision(snakeHead, maxHeight, maxWidth) {
  const leftCollison = snakeHead.x < 0;
  const topCollison = snakeHead.y < 0;
  const rightCollison = snakeHead.x > maxWidth - gridSize;
  const bottomCollison = snakeHead.y > maxHeight - gridSize;
  return leftCollison || topCollison || rightCollison || bottomCollison;
}
/*
  util functions that i can move to snakeUtil.js
  */
export {
  detectOpponentCollision,
  getRandomCanvasPositionMargin,
  getSnakesInStartingPosition,
  getInitialFoods,
  detectWallCollision,
  detectSelfCollision,
  getRandomStartingPosLeft,
  getRandomStartingPosRight,
  getRandomStartingPosBottom,
  getRandomStartingPosTop,
  isInvalidMove,
};
