import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import CountdownAnimation from '../../common/CountdownAnimation';
let SNAKE_COLORS = ['#F44336',
    '#9C27B0',
    '#2196F3',
    '#4CAF50',
    '#FFEB3B',
    '#FF9800',
    '#607D8B',
    '#795548',
    '#E91E63',
    '#3F51B5',
    '#673AB7',
    '#00BCD4',
    '#03A9F4',
    '#8BC34A',
    '#CDDC39',
    '#009688',
    '#FFC107',
    '#FF5722',
];
let SNAKE_NAMES = ['Stan',
    'Jane',
    'Sara',
    'Dan',
    'Lisa',
    'Joe',
    'Rose',
    'Ray',
    'Lyra',
    'Sam',
    'Lucy',
    'Ben',
    'Noa',
    'Mark',
    'Eve',
    'Ned',
    'Ann',
    'Todd']
class SnakeStarting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: this.startCounter(),
            snakesize: 30,
        }
        this.nextPhase = this.nextPhase.bind(this);
        this.createSnakes = this.createSnakes.bind(this);
        this.createCoopSnakes = this.createCoopSnakes.bind(this);
    }
    startCounter() {
        let that = this;
        let counter = 5;
        let i = setInterval(function () {
            counter--;
            that.setState({ counter: counter });
            if (counter === 0) {
                that.nextPhase();
                clearInterval(i);
            }
        }, 1000);
        return 5;
    }
    createSnakes() {
        let playerKeys = Object.keys(this.props.game.players);
        let startingY = 90;
        let startingX = 300;
        let snakes = [];
        for (let i = 0; i < playerKeys.length; i++) {
            let player = this.props.game.players[playerKeys[i]];
            let snake = {
                playerKeys: [player.key],
                direction: 'right',
                nextDirection: 'right',
                actions: ['up', 'down', 'right', 'left'],
                score: 0,
                color: SNAKE_COLORS[i],
                name: SNAKE_NAMES[i],
                id: i,
                body: [{
                    x: startingX,
                    y: startingY + (i * 90),
                }, {
                    x: startingX - this.state.snakesize,
                    y: startingY + (i * 90),
                }, {
                    x: startingX - (this.state.snakesize * 2),
                    y: startingY + (i * 90),
                }, {
                    x: startingX - (this.state.snakesize * 3),
                    y: startingY + (i * 90),
                }]

            }
            snakes.push(snake);
            //här ska jag lägga till såd et finns en food per player?
            //foods.push(food);
        }
        return snakes;
    }
    createCoopSnakes() {
        let playerKeys = Object.keys(this.props.game.players);
        let startingY = 100;
        let startingX = 300;
        let snakes = [];
        let nrOfSnakes = playerKeys
        //coop snakes här vil jag kunna hitta ultimata updelningen. man ska kunna vara 2 eller 4 per orm. om det är ojämnt antal får man vara en 3a.
        //chunkify tar in playerkeys och en siffra på hur många snakes det ska vara och delar upp dem men då behöver jag veta hur många snakes jag vill ha?
        //kanske får göra en helt egen chunkify? behöver veta hur mågna snakes jag vill ha och sen kanske det löser sig självt i loopen

        for (let i = 0; i < playerKeys.length; i++) {
            let player = this.props.game.players[playerKeys[i]];
            let snake = {
                playerKeys: [player.key],
                direction: 'right',
                nextDirection: 'right',
                id: i,
                score: 0,
                body: [{
                    x: startingX,
                    y: startingY,
                }, {
                    x: startingX - this.state.settings.snake.size,
                    y: startingY,
                }, {
                    x: startingX - (this.state.settings.snake.size * 2),
                    y: startingY,
                }, {
                    x: startingX - (this.state.settings.snake.size * 3),
                    y: startingY,
                }]

            }
            snakes.push(snake);
            //här ska jag lägga till såd et finns en food per player?
            //foods.push(food);
        }
        return snakes;
    }

    chunkify(a, n) {
        if (n < 2)
            return [a];

        let len = a.length,
            out = [],
            i = 0,
            size;

        if (len % n === 0) {
            size = Math.floor(len / n);
            while (i < len) {
                out.push(a.slice(i, i += size));
            }
        }
        else {
            while (i < len) {
                size = Math.ceil((len - i) / n--);
                out.push(a.slice(i, i += size));
            }
        }

        return out;
    }

    nextPhase() {
        let snakes = [];
        if (this.props.game.minigame.useTeams) {
            snakes = this.createCoopSnakes();
        } else {
            snakes = this.createSnakes();
        }
        let players = this.props.game.players;
        for (let i = 0; i < snakes.length; i++) {
            let actionChunks = this.chunkify(snakes[i].actions, snakes[i].playerKeys.length);
            for (let j = 0; j < snakes[i].playerKeys.length; j++) {
                let player = players[snakes[i].playerKeys[j]];
                player.snakeId = snakes[i].id;
                player.controlActions = actionChunks[j];
                //players[snakes[i].playerKeys[j]] = player;
            }
        }


        let game = this.props.game;
        game.minigame.snakes = snakes;
        game.phase = "gameplay";
        game.players = players;

        this.props.gameFunc.update(game);
    }
    //på componentDidMount så starta en timer eller liknande. koppla timern till något visuellt. typ en materialUI progressbar. 0-100 som visas.
    //när timern är klar så updateras phase till nästa

    render() {
        return (
            <div className="phase-container">
                <Typography variant="h2">Starting quiz</Typography>
                <CountdownAnimation speed="slow" />
            </div>
        );
    }
}

export default SnakeStarting;