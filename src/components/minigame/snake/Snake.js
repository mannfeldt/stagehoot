import React, { Component } from 'react';
import { fire } from '../../../base';

let ctx;
let canvas;

class Snake extends Component {
    constructor(props) {
        super(props);
        //för att göra det mer smooth. så behöver jag typ dela upp ätandet så att det sker i flera tick? för just nu är ett tick storleken på food och allt annat
        //lite delay när jag ökar speeden. är det olika delay för olika snakes? optimera senare.
        this.state = {
            gameTicker: null,
            ticks: 0,
            settings: {
                snake: {
                    size: 10,
                    speed: this.props.game.minigame.difficulty,
                    border: '#000',
                    respawntime: 3,
                },
                food: {
                    background: '#EC5E0B',
                    border: '#73AA24',
                },
                canvas: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    background: '#F5F5F5',
                    border: '#000'
                },
            }
        };
        this.state.snakes = this.getSnakesInStartingPosition(this.props.game.minigame.snakes, this.state.settings);
        let initialFoods = [];
        for (let i = 0; i < this.props.game.minigame.snakes.length*3; i++) {
            let food = {
                index: i,
                active: false,
            }
            initialFoods.push(food);
        }
        this.state.foods = initialFoods;

        this.drawSnakes = this.drawSnakes.bind(this);
        this.generateFood = this.generateFood.bind(this);
        this.generateSnakes = this.generateSnakes.bind(this);
        this.resetCanvas = this.resetCanvas.bind(this);
        this.drawFood = this.drawFood.bind(this);
        this.detectCollisions = this.detectCollisions.bind(this);
        this.endGame = this.endGame.bind(this);
        this.initControllerListener = this.initControllerListener.bind(this);
        this.generateFoods = this.generateFoods.bind(this);
        this.isEndGame = this.isEndGame.bind(this);
        this.detectOpponentCollision = this.detectOpponentCollision.bind(this);
        this.detectSelfCollision = this.detectSelfCollision.bind(this);

    }
    //vissa snakes lyckas inte äta foods? är det en bugg med konstiga synkningar mot state när det är så många?
    //det verkar inte heller fungera med positioneringen indexof. Ormarna hamnar ibland precis brevid varandra.
    getSnakesInStartingPosition(snakes, settings) {
        for (let i = 0; i < snakes.length; i++) {
            let snake = snakes[i];
            snake.direction = snake.actions[i % 4];
            let pos;
            switch (snake.direction) {
                case 'right':
                    pos = this.getRandomStartingPosLeft(snakes, settings);
                    snake.body = [{
                        x: pos.x,
                        y: pos.y,
                    }, {
                        x: pos.x - settings.snake.size,
                        y: pos.y,
                    }, {
                        x: pos.x - (settings.snake.size * 2),
                        y: pos.y,
                    }, {
                        x: pos.x - (settings.snake.size * 3),
                        y: pos.y,
                    }];
                    break;
                case 'left':
                    pos = this.getRandomStartingPosRight(snakes, settings);
                    snake.body = [{
                        x: pos.x,
                        y: pos.y,
                    }, {
                        x: pos.x + settings.snake.size,
                        y: pos.y,
                    }, {
                        x: pos.x + (settings.snake.size * 2),
                        y: pos.y,
                    }, {
                        x: pos.x + (settings.snake.size * 3),
                        y: pos.y,
                    }];
                    break;
                case 'up':
                    pos = this.getRandomStartingPosBottom(snakes, settings);
                    snake.body = [{
                        x: pos.x,
                        y: pos.y,
                    }, {
                        x: pos.x,
                        y: pos.y + settings.snake.size,
                    }, {
                        x: pos.x,
                        y: pos.y + (settings.snake.size * 2),
                    }, {
                        x: pos.x,
                        y: pos.y + (settings.snake.size * 3),
                    }];
                    break;
                case 'down':
                    pos = this.getRandomStartingPosTop(snakes, settings);
                    snake.body = [{
                        x: pos.x,
                        y: pos.y,
                    }, {
                        x: pos.x,
                        y: pos.y - settings.snake.size,
                    }, {
                        x: pos.x,
                        y: pos.y - (settings.snake.size * 2),
                    }, {
                        x: pos.x,
                        y: pos.y - (settings.snake.size * 3),
                    }];
                    break;
                default:
                    break;
            }
        }

        return snakes;


    }
    getRandomStartingPosTop(snakes, settings) {

        let existingValues = [];
        for (let i = 0; i < snakes.length; i++) {
            let snake = snakes[i];
            if (snake.direction === "down" && snake.body) {
                existingValues.push(snake.body[0].y);
            }
        }

        let gridSize = settings.snake.size;
        let margin = gridSize * 8;
        let xMax = settings.canvas.width - (margin * 2);
        let y = gridSize * 2;
        let x = this.getRandomStartingPos(xMax, margin, existingValues, gridSize);
        return { x: x, y: y };
    }
    getRandomStartingPosBottom(snakes, settings) {

        let existingValues = [];
        for (let i = 0; i < snakes.length; i++) {
            let snake = snakes[i];
            if (snake.direction === "up" && snake.body) {
                existingValues.push(snake.body[0].y);
            }
        }

        let gridSize = settings.snake.size;
        let margin = gridSize * 8;
        let xMax = settings.canvas.width - (margin * 2);
        let y = settings.canvas.height - (gridSize * 3);
        let x = this.getRandomStartingPos(xMax, margin, existingValues, gridSize);
        return { x: x, y: y };
    }
    getRandomStartingPosRight(snakes, settings) {

        let existingValues = [];
        for (let i = 0; i < snakes.length; i++) {
            let snake = snakes[i];
            if (snake.direction === "left" && snake.body) {
                existingValues.push(snake.body[0].y);
            }
        }

        let gridSize = settings.snake.size;
        let margin = gridSize * 8;
        let yMax = settings.canvas.height - (margin * 2);
        let x = settings.canvas.width - (gridSize * 3);
        let y = this.getRandomStartingPos(yMax, margin, existingValues, gridSize);
        return { x: x, y: y };
    }
    getRandomStartingPosLeft(snakes, settings) {
        let existingValues = [];
        for (let i = 0; i < snakes.length; i++) {
            let snake = snakes[i];
            if (snake.direction === "right" && snake.body) {
                existingValues.push(snake.body[0].y);
            }
        }
        let gridSize = settings.snake.size;
        let margin = gridSize * 8;
        let yMax = settings.canvas.height - (margin * 2);
        let x = gridSize * 2;
        let y = this.getRandomStartingPos(yMax, margin, existingValues, gridSize);
        return { x: x, y: y };

    }
    getRandomStartingPos(max, margin, existingValues, gridSize) {
        let value = Math.round((Math.random() * max) / gridSize) * gridSize + margin;
        if (existingValues.indexOf(value) > -1 ||
            existingValues.indexOf(value + gridSize) > -1 ||
            existingValues.indexOf(value - gridSize) > -1) {
            return this.getRandomStartingPos(max, margin, existingValues, gridSize);
        }
        return value;

    }

    componentDidMount() {
        let app = document.querySelector('#snakeboard');

        canvas = app.querySelector('canvas');
        ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = "screen"

        //problem vid restart så skapas en ny användare. test spara playerkey till localhost och testa använda den keyn om den passar
        this.generateSnakes();

        let gameTicker = setInterval(() => {
            if (!this.isEndGame()) {
                this.detectCollisions();
                this.generateSnakes();
            } else {
                this.endGame();
            }
        }, this.state.settings.snake.speed);

        this.setState({ gameTicker: gameTicker });

        for (let i = 0; i < this.state.snakes.length; i++) {
            let snake = this.state.snakes[i];
            this.initControllerListener(snake);
        }
    }
    initControllerListener(snake) {
        var snakeRef = fire.database().ref('/games/' + this.props.game.key + '/minigame/snakes/' + snake.id);
        let that = this;
        snakeRef.on('value', function (snapshot) {
            let snake = snapshot.val();
            if (snake) {
                //kan blir problem med asynch setstate?
                that.setState(function (state, props) {
                    let snakes = [...state.snakes];
                    //kolla så att detta är okej sätt, blir snakes index alltid rätt kopplat till snake.id? ska jag fixa ett riktigt ID för att vara säker? alltså ett pushid
                    if (snake.move) {
                        snakes[snake.id].direction = snake.move;
                    }
                    return {
                        snakes: snakes
                    };
                });
            } else {
                console.log("move error");
            }
        });
        //koppla this.state.game till gameKey
        //lägg till en likadan listener i Play.
        //hosts gamelistiner ska lyssna på alla ändringar. Play ska inte lyssna på andra players ändringar om det går. något att optimera i framtiden.
        //ett alt är att lyfta ut Players till en egen root? kan lägga phase och currentq i en game.state och sen är det allt som Player lyssnar på?
        //men play behöver också behöva synca sin egna player.
    }
    isEndGame() {
        //om det är survival så returnera true om det bara finns en snake kvar in game

        //om det är reace så returnera true som någon snake har nått winning score/length,

        if (this.props.game.minigame.gamemode === "survival") {
            if (this.state.snakes.length === 1) {
                return this.state.snakes[0].dead;
            }
            let snakesRemaining = 0;
            for (let i = 0; i < this.state.snakes.length; i++) {
                if (!this.state.snakes[i].dead) {
                    snakesRemaining += 1;
                }
                if (snakesRemaining > 1) {
                    return false;
                }
            }
            return true;

        } else if (this.props.game.minigame.gamemode === "race") {
            for (let i = 0; i < this.state.snakes.length; i++) {
                if (this.state.snakes[i].body.length >= this.props.game.minigame.racetarget) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    shouldComponentUpdate(){
        //kan jag ha det här?
        return false;
    }


    resetCanvas() {
        // Full screen size

        canvas.width = this.state.settings.canvas.width;
        canvas.height = this.state.settings.canvas.height;


        // Background
        ctx.fillStyle = this.state.settings.canvas.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //lägg in denna i callbacken? eller hur fungar det?
        //funkar det ens att updater this.state.ctx.fillRect()? eller behöcer jag spara vissa canvas saker utanför react?
    }
    getRandomCanvasPositionMargin(gridSize, yMax, xMax) {
        let x = Math.round((Math.random() * (xMax - (gridSize * 14))) / gridSize) * gridSize + (gridSize * 4);
        let y = Math.round((Math.random() * (yMax - (gridSize * 2))) / gridSize) * gridSize + (gridSize * 2);
        return { x: x, y: y };

    }
    generateSnakes() {
        //i alla såna här dpelarspecifika metoder måste jag ta in vilken snake/player det gäller
        let snakes = [];
        for (let i = 0; i < this.state.snakes.length; i++) {
            //behöver jag göra en copy? spelar det någon roll?
            let snake = this.state.snakes[i];
            if (snake.respawning) {
                if (Date.now() > snake.respawntime) {
                    snake.dead = false;
                    snake.respawning = false;
                }
                snakes.push(snake);
                //kanske ta bort contrinue? så att den hoppar igång direkt?
                continue;
            } else if (snake.dead) {
                if (this.props.game.minigame.gamemode === "survival") {
                    snake.body = [];
                    snakes.push(snake);
                    continue;
                } else if (this.props.game.minigame.gamemode === "race") {
                    const gridSize = this.state.settings.snake.size;
                    const xMax = this.state.settings.canvas.width - gridSize;
                    const yMax = this.state.settings.canvas.height - gridSize;
                    let startPos = this.getRandomCanvasPositionMargin(gridSize, yMax, xMax);
                    snake.body = [{
                        x: startPos.x,
                        y: startPos.y,
                    }, {
                        x: startPos.x - gridSize,
                        y: startPos.y,
                    }, {
                        x: startPos.x - (gridSize * 2),
                        y: startPos.y,
                    }, {
                        x: startPos.x - (gridSize * 3),
                        y: startPos.y,
                    }]
                    snake.direction = "right";
                    //räkna ut och sätt ny body (length,x,y). 
                    //snake.dead = false;
                    snake.respawning = true;
                    snake.respawntime = Date.now() + (this.state.settings.snake.respawntime * 1000);
                    snakes.push(snake);
                    continue;
                }
            }

            let body = snake.body;
            let coordinate;

            switch (snake.direction) {
                case 'right':
                    coordinate = {
                        x: body[0].x + this.state.settings.snake.size,
                        y: body[0].y
                    };
                    break;
                case 'up':
                    coordinate = {
                        x: body[0].x,
                        y: body[0].y - this.state.settings.snake.size
                    };
                    break;
                case 'left':
                    coordinate = {
                        x: body[0].x - this.state.settings.snake.size,
                        y: body[0].y
                    };
                    break;
                case 'down':
                    coordinate = {
                        x: body[0].x,
                        y: body[0].y + this.state.settings.snake.size
                    };
                    break;
                default:
                    break;
            }

            // The snake moves by adding a piece to the beginning "this.snake.unshift(coordinate)" and removing the last piece "this.snake.pop()"
            // Except when it eats the food in which case there is no need to remove a piece and the added piece will make it grow
            body.unshift(coordinate);


            this.resetCanvas();
            let eatenFood;
            let foods = [...this.state.foods];
            for (let j = 0; j < foods.length; j++) {
                let food = foods[j];
                if (body[0].x === food.x && body[0].y === food.y) {
                    eatenFood = food;
                    break;
                }
            }
            //const ateFood = body[0].x === this.state.food.coordinates.x && body[0].y === this.state.food.coordinates.y;


            if (eatenFood) {
                this.setState(function (state, props) {
                    let foods = [...state.foods];
                    foods[eatenFood.index].active = false;
                    return {
                        foods: foods,
                    };
                });
                snake.score += 10;
            } else {
                body.pop();
            }
            //snake.body = body;
            snakes.push(snake);
        }
        this.setState(function (state, props) {
            let ticks = state.ticks;
            return {
                snakes: snakes,
                ticks: ticks + 1,
            };
        });

        this.generateFoods();
        this.drawSnakes();
    }

    drawSnakes() {
        const size = this.state.settings.snake.size;
        //ctx.globalCompositeOperation = "multiply";

        for (let i = 0; i < this.state.snakes.length; i++) {
            let snake = this.state.snakes[i];
            if (snake.respawning && this.state.ticks % 2 === 0) {
                ctx.fillStyle = this.state.settings.canvas.background;
            } else {
                ctx.fillStyle = snake.color;
            }
            ctx.strokestyle = this.state.settings.snake.border;
            let body = snake.body;
            // Draw each piece

            //om två snakes är över varandra så finns en schysst style för det som han gick igenom på öredev. där färgerna från båda kan blandas till en ljusare eller mörkar.
            body.forEach(coordinate => {
                ctx.fillRect(coordinate.x, coordinate.y, size, size);
                ctx.strokeRect(coordinate.x, coordinate.y, size, size);
            });


            //this.game.direction = this.game.nextDirection;
        }
        /*
        jag kör rakt av på direction, verkar fungera och snabbare response då? om jag vill ha tillbaka nextdirection så ta fram denna metod och sätt i snakeListenern att den ska sätta nextDirection
        this.setState(function (state, props) {
            let snakes = state.snakes;
            for (let i = 0; i < snakes.length; i++) {
                snakes[i].direction = snakes[i].nextDirection;
            }
            return {
                snakes: snakes,
            };
        });
        */
    }

    generateFoods() {
        let foods = [...this.state.foods];
        for (let i = 0; i < foods.length; i++) {
            let food = foods[i];
            this.generateFood(food);
        }
        this.setState(function (state, props) {
            //state.ctx.fillRect(0, 0, canvas.width, canvas.height);
            return {
                foods: foods,
            };
        });
    }

    generateFood(food) {
        // If there is uneaten food on the canvas there's no need to regenerate it

        if (food.active) {
            this.drawFood(food);
            return;
        }

        const gridSize = this.state.settings.snake.size;
        const xMax = this.state.settings.canvas.width - gridSize;
        const yMax = this.state.settings.canvas.height - gridSize;

        food.x = Math.round((Math.random() * xMax) / gridSize) * gridSize;
        food.y = Math.round((Math.random() * yMax) / gridSize) * gridSize;
        //this.drawFood(x, y);

        // Make sure the generated coordinates do not conflict with the snake's present location
        // If so recall this method recursively to try again
        for (let i = 0; i < this.state.snakes.length; i++) {
            let snake = this.state.snakes[i];
            snake.body.forEach(coordinate => {
                const foodSnakeConflict = coordinate.x === food.x && coordinate.y === food.y;
                if (foodSnakeConflict) {
                    this.generateFood();
                } else {
                    this.drawFood(food);
                }
            });
        }

    }

    drawFood(food) {
        //denna metod kallas lite väl många gånger?? ioptimera?
        const size = this.state.settings.snake.size;
        ctx.fillStyle = this.state.settings.food.background;
        ctx.strokestyle = this.state.settings.food.border;

        ctx.fillRect(food.x, food.y, size, size);
        ctx.strokeRect(food.x, food.y, size, size);
        food.active = true;

    }

    detectCollisions() {
        //ha olika modes för krock med motståndare
        //2. krock med motståndare så händer inget
        //3. krock med motståndare så äts motståndaren upp (head-on-head så dör båda)
        //4. korck med motståndare så dör man
        //modes krock med vägg:
        //1. man dör
        //2. man kommer ut på andra sidan
        //vad händer om man får en selfcollision sammtidigt som någon får en opponentcollision i den?
        //mode dö:
        //när man dör så får man återställs man till liten mask
        //när man dör så är man död för alltid

        // Self collison
        // It's impossible for the first 3 pieces of the snake to self collide so the loop starts at 4

        //fixa en bättre metod för alla snakes senare

        //fundra och test som det här är den mest effektiva lösningen? eller om jag gör några checks i onödan?
        //jag vill nog bara göra en gemensam setState call efter den här loopen. så alla ändringar för t.ex. handleDeath
        let snakes = this.state.snakes;
        for (let i = 0; i < snakes.length; i++) {
            if (snakes[i].dead) {
                continue;
            }
            if (this.detectSelfCollision(snakes[i])) {
                //vilken av dessa fungerar?
                snakes[i].dead = true;
                //snakes[i].dead = true;

                //this.handleDeath(snake);
            }
        }

        if (this.props.game.minigame.opponentCollision) {
            //här inne så ändrar jag om i snakes genom att döda dem som ska dödas och klyver om det ska klyvas osv. det som returneras ska vara korrekta snakes
            snakes = this.detectOpponentCollision(snakes);
        }
        this.setState(function (state, props) {
            return {
                snakes: snakes,
            };
        });



    }

    detectOpponentCollision(snakes) {
        for (let i = 0; i < snakes.length; i++) {
            if (snakes[i].dead) {
                //om den redan är död så fortsätt. t.ex. en headon så kör jag båda två till dead direkt.
                continue;
            }
            let currentSnakeBody = snakes[i].body;
            for (let j = 0; j < snakes.length; j++) {
                //om opponents är död så ska man inte kunna krocka med den. döda snakes har ju fortfarande coordinater. alt är att ta bort coordinaterna
                if (j === i || snakes[j].dead) {
                    continue;
                }
                let opponentSnakeBody = snakes[j].body;
                //lägga till en function där om man äter body[1] så där opponent?
                for (let k = 0; k < opponentSnakeBody.length; k++) {
                    const collision = opponentSnakeBody[k].x === currentSnakeBody[0].x && opponentSnakeBody[k].y === currentSnakeBody[0].y;
                    if (collision) {
                        if (k === 0) {
                            snakes[i].dead = true;
                            snakes[j].dead = true;
                            //collision head>head
                        } else if (this.props.game.minigame.eatOpponents) {
                            //snakes
                            snakes[j].body.length = k;
                            //kan jag använda opponentSnakeBody istället för snakes[j].body
                            //opponentSnakeBody.length = k;?

                        } else {
                            snakes[i].dead = true;
                        }
                    }
                }

            }
        }
        //loppa igenom alla snakes och se om det finns collision, blir loop i en loop?
        //fixa till alla snakes som har krockat, dvs kolla vilka modes som är aktiva och klyv/döda snakes accordingly

        //loopa alla snakes utom en själv och se om man krockat med någon. 
        // om det är en krock så kolla om det eatOpponent är true. 
        //Är det true och man inte krockat med opponent.body[0]så ska opponent klyvas på den punkten om det är false så ska man själv dö (handleDeath(snake))
        return snakes;
    }
    detectSelfCollision(snake) {
        let body = snake.body;
        for (let i = 4; i < body.length; i++) {
            const selfCollison = body[i].x === body[0].x && body[i].y === body[0].y;

            if (selfCollison) {
                return true;
            }
        }

        // Wall collison
        const leftCollison = body[0].x < 0;
        const topCollison = body[0].y < 0;
        const rightCollison = body[0].x > canvas.width - this.state.settings.snake.size;
        const bottomCollison = body[0].y > canvas.height - this.state.settings.snake.size;

        if (leftCollison || topCollison || rightCollison || bottomCollison) {
            //this.handleDeath(snake);
            return true;
        }
        return false;
    }

    endGame() {

        clearInterval(this.state.gameTicker);
        alert("game over");
        //this.setUpGame();
    }
    render() {
        return (
            <div className="phase-container" id="snakeboard">
                <canvas></canvas>
            </div>
        );
    }
}

export default Snake;