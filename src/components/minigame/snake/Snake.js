import React, { Component } from 'react';
import { fire } from '../../../base';

let ctx;
let canvas;

class Snake extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameTicker: null,
            snakes: this.props.game.minigame.snakes,
            food: {},
            ticks: 0,
            settings: {
                snake: {
                    size: 30,
                    speed: 1000,
                    border: '#000'
                },
                canvas: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    background: '#F5F5F5',
                    border: '#000'
                },
                keyCodes: {
                    38: 'up',
                    40: 'down',
                    39: 'right',
                    37: 'left'
                }
            }
        };

        let foods = [];
        let food = {
            active: false,
            background: '#EC5E0B',
            border: '#73AA24',
            coordinates: {
                x: 0,
                y: 0
            }
        };;

        this.state.food = food;
        this.drawSnakes = this.drawSnakes.bind(this);
        this.changeDirection = this.changeDirection.bind(this);
        this.generateFood = this.generateFood.bind(this);
        this.generateSnake = this.generateSnake.bind(this);
        this.validateDirectionChange = this.validateDirectionChange.bind(this);
        this.resetCanvas = this.resetCanvas.bind(this);
        this.drawFood = this.drawFood.bind(this);
        this.detectCollision = this.detectCollision.bind(this);
        this.endGame = this.endGame.bind(this);
        this.initControllerListener = this.initControllerListener.bind(this);
    }

    componentDidMount() {
        let app = document.querySelector('#snakeboard');

        canvas = app.querySelector('canvas');
        ctx = canvas.getContext('2d');
        //problem vid restart så skapas en ny användare. test spara playerkey till localhost och testa använda den keyn om den passar
        this.generateSnake();

        let gameTicker = setInterval(() => {
            if (!this.detectCollision()) {
                this.generateSnake();
            } else {
                this.endGame();
            }
        }, this.state.settings.snake.speed);

        this.setState({ gameTicker: gameTicker });

        // Change direction
        document.addEventListener('keydown', event => {
            this.changeDirection(event.keyCode);
        });
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
                    let snakes = state.snakes;
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

    /*
    shouldComponentUpdate(){
        return false;
    }
    */
    //"Lyssnaren" som kollar om det finns ändringar i snakes.x.move updaterar state.snakes.x.nextDirection med det isåfall.
    //då det alltid finns en lyssnare på detta i snake så kommer denna komponent att uppdateras när jag gör min action i Play så då kan jag lika gärna använda det som lyssnare
    //alternativen är 1. att göra en dedikerad ytterligare lyssnare här. 2. använda componentDidUpdate() eller annan metod som kolla på detta.
    //målet är att ändringen på "move" från players ska sätta movet till nextDirection på rätt snake här.
    //shouldcomponentUpdate kan jag ju sätta till false? om jag skapar en separat lyssnare. det kanske är det effektivaste? kan jag skapa en lyssnare på snake?
    //skapa lyssnarna i componentDidMount(), loopa igenom alla snakes och skapa en lyssnare per snake som kolla på snakens "move" när det ändras så triggas en updatet till state.snakes.x.nextDirection

    /*
     static getDerivedStateFromProps(props, current_state) {
         //uppdaterar nextDirection om det finns nytt move
         function updateSnakes(newSnakes, currentSnakes) {
             for (let i = 0; i < currentSnakes.length; i++) {
                 if (currentSnakes[i].nextDirection !== newSnakes[i].move) {
                     currentSnakes[i].nextDirection = newSnakes[i].move;
                 }
             }
             return currentSnakes;
         }
         if (props.game.minigame.snakes) {
             let currentSnakes = current_state.snakes;
             return {
                 snakes: updateSnakes(props.game.minigame.snakes, currentSnakes)
             }
         }
 
         return null
     }
 */
    changeDirection(keyCode) {
        const validKeyPress = Object.keys(this.state.settings.keyCodes).includes(keyCode.toString()); // Only allow (up|down|left|right)

        if (validKeyPress && this.validateDirectionChange(this.state.settings.keyCodes[keyCode], this.state.snakes[0].direction)) {
            this.setState(function (state, props) {
                let snakes = state.snakes;
                snakes[0].nextDirection = state.settings.keyCodes[keyCode];
                return {
                    snakes: snakes
                };
            });
        }
    }

    // When already moving in one direction snake shouldn't be allowed to move in the opposite direction
    validateDirectionChange(keyPress, currentDirection) {
        return (keyPress === 'left' && currentDirection !== 'right') ||
            (keyPress === 'right' && currentDirection !== 'left') ||
            (keyPress === 'up' && currentDirection !== 'down') ||
            (keyPress === 'down' && currentDirection !== 'up');
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

    generateSnake() {
        //i alla såna här dpelarspecifika metoder måste jag ta in vilken snake/player det gäller
        let snakes = [];
        for (let i = 0; i < this.state.snakes.length; i++) {
            let snake = this.state.snakes[i];
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

            //?
            this.resetCanvas();

            const ateFood = body[0].x === this.state.food.coordinates.x && body[0].y === this.state.food.coordinates.y;

            if (ateFood) {
                this.setState(function (state, props) {
                    let food = state.food;
                    food.active = false;
                    return {
                        food: food,
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

        this.generateFood();
        this.drawSnakes();
    }

    drawSnakes() {
        const size = this.state.settings.snake.size;
        //  let ctx = ctx;



        for (let i = 0; i < this.state.snakes.length; i++) {
            let snake = this.state.snakes[i];
            ctx.fillStyle = snake.color;
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

    generateFood() {
        // If there is uneaten food on the canvas there's no need to regenerate it
        if (this.state.food.active) {
            this.drawFood(this.state.food.coordinates.x, this.state.food.coordinates.y);
            return;
        }

        const gridSize = this.state.settings.snake.size;
        const xMax = this.state.settings.canvas.width - gridSize;
        const yMax = this.state.settings.canvas.height - gridSize;

        const x = Math.round((Math.random() * xMax) / gridSize) * gridSize;
        const y = Math.round((Math.random() * yMax) / gridSize) * gridSize;
        this.drawFood(x, y);

        // Make sure the generated coordinates do not conflict with the snake's present location
        // If so recall this method recursively to try again
        /* 
         this.snake.forEach(coordinate => {
             const foodSnakeConflict = coordinate.x == x && coordinate.y == y;
     
             if (foodSnakeConflict) {
                 this.generateFood();
             } else {
                 this.drawFood(x, y);
             }
         });
         */
    }

    drawFood(x, y) {
        const size = this.state.settings.snake.size;
        ctx.fillStyle = this.state.food.background;
        ctx.strokestyle = this.state.food.border;

        ctx.fillRect(x, y, size, size);
        ctx.strokeRect(x, y, size, size);



        this.setState(function (state, props) {
            let food = state.food;
            food.active = true;
            food.coordinates.x = x;
            food.coordinates.y = y;
            //state.ctx.fillRect(0, 0, canvas.width, canvas.height);
            return {
                food: food,
            };
        });

    }

    detectCollision() {
        //ha olika modes för krock med motståndare
        //2. krock med motståndare så händer inget
        //3. krock med motståndare så äts motståndaren upp (head-on-head så dör båda)
        //4. korck med motståndare så dör man
        //modes krock med vägg:
        //1. man dör
        //2. man kommer ut på andra sidan

        //mode dö:
        //när man dör så får man återställs man till liten mask
        //när man dör så är man död för alltid

        // Self collison
        // It's impossible for the first 3 pieces of the snake to self collide so the loop starts at 4

        //fixa en bättre metod för alla snakes senare
        let body = this.state.snakes[0].body;
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

        return leftCollison || topCollison || rightCollison || bottomCollison;
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