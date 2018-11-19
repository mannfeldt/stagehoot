import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CreateSnake from './CreateSnake';
import CreateTetris from './CreateTetris';

class CreateMinigame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gametype:''
        };
    }

    setGameType = name => event => {
        this.setState({ gametype: name });
    };

    render() {
        return (
            <div className="app-page create-page">
                {!this.state.gametype && <Grid container spacing={24}>
                    <Button onClick={this.setGameType("snake")} variant="contained">Snake</Button>
                    <Button onClick={this.setGameType("tetris")} variant="contained">Tetris</Button>
                </Grid>}
                skulle kunna ha generallisering här i minigame? 
                gemensamma phases som ligger under minigame/play minigame/host och sen kan det finnas en mapp för varje game minigame/snake som innehåller vissa specifika phases
                {this.state.gametype === "snake" && <CreateSnake createGame={this.props.createGame}/>}
                {this.state.gametype === "tetris" && <CreateTetris createGame={this.props.createGame}/>}


            </div>
        );
    }
}
export default CreateMinigame;