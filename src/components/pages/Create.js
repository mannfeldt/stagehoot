import React, { Component } from 'react';
import { fire } from '../../base';
import CreateQuiz from '../create/CreateQuiz';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gametype: '',
            gameId: '',
        };
        this.createGame = this.createGame.bind(this);
        this.validateGame = this.validateGame.bind(this);
        this.generateGameId = this.generateGameId.bind(this);

    }

    setGameType = name => event => {
        this.setState({ gametype: name });
    };

    createGame(game) {
        game.gameId = this.generateGameId();
        game.created = Date.now();
        game.status = "CREATED";
        game.phase = "setup";
        if (!this.validateGame(game)) {
            return;
        }

        let that = this;
        //game push få ett id.
        let gameRef = fire.database().ref('/games').push();
        game.key = gameRef.key;
        gameRef.set(game, function (error) {
            if (error) {
                that.setState({
                    errorText: 'Error: ' + error,
                });
                let snack = {
                    variant: "error",
                    message: "Unexpected internal error"
                }
                that.props.showSnackbar(snack);
            }
            else {
                let snack = {
                    variant: "success",
                    message: "Successfully created!"
                }
                that.props.showSnackbar(snack);
                that.setState({
                    gameId: game.gameId,
                    gametype: 'done'
                });
                localStorage.setItem('RecentGameId', game.gameId);

                //show gameid and password
                //show button to start game / navigate to host
            }
        });
    }
    validateGame(game) {
        //validera lösenord är tillräckligt starkt här eller direkt efter input om det finns någon smart lösning.
        //kolla på gametype hur ha en secifik validering för varje type
        let snack = {
            variant: "error",
            message: "explain error or errors/"
        }
        //this.props.showSnackbar(snack);
        return true;

    }

    generateGameId() {
        let id = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 6; i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return id;
    }

    render() {
        return (
            <div className="app-page create-page">
                {!this.state.gametype && <Grid container spacing={24}>
                    <Button onClick={this.setGameType("quiz")} variant="contained">Quiz</Button>
                    <Button onClick={this.setGameType("survey")} variant="contained">Survey</Button>
                    <Button onClick={this.setGameType("minigame")} variant="contained">Mini game</Button>
                    <Button onClick={this.setGameType("discussion")} variant="contained">Discussion</Button>
                </Grid>}
                {this.state.gametype === "quiz" && <CreateQuiz createQuiz={this.createGame} showSnackbar={this.props.showSnackbar} />}
                {this.state.gametype === "done" &&
                    <div>
                        <Typography variant="h3">Created game ID: {this.state.gameId}</Typography>
                        <Link to={'/host'}>Host game</Link>
                    </div>
                }
            </div>
        );
    }
}

export default Create;