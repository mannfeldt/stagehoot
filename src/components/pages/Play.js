import React, { Component } from 'react';
import { fire } from '../../base';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Quiz from '../quiz/play/Quiz';
class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {},
            gameId: '',
            playerKey: '',

        };
        this.createPlayer = this.createPlayer.bind(this);
        this.fetchGame = this.fetchGame.bind(this);
    }

    fetchGame() {
        let that = this;
        fire.database().ref('games').orderByChild("gameId").equalTo(that.state.gameId).once("value", function (snapshot) {
            if (snapshot.val()) {
                let game;
                snapshot.forEach(function (child) {
                    game = child.val();
                });
                if (game.phase === "connection") {
                    that.initGameListiner(game.key);
                    let snack = {
                        variant: "success",
                        message: "Connected to game"
                    }
                    that.props.showSnackbar(snack);
                    that.props.toggleHeader();
                } else if (game.phase === "setup") {
                    let snack = {
                        variant: "error",
                        message: "Game is not yet started"
                    }
                    that.props.showSnackbar(snack);
                } else {
                    let snack = {
                        variant: "error",
                        message: "Game is in progress"
                    }
                    that.props.showSnackbar(snack);
                }
            } else {
                let snack = {
                    variant: "info",
                    message: "No game found"
                }
                that.props.showSnackbar(snack);
            }
        });
    }

    initGameListiner(gameKey) {
        var gameRef = fire.database().ref('games/' + gameKey);
        let that = this;
        gameRef.on('value', function (snapshot) {
            let game = snapshot.val();
            if (game) {
                //kan blir problem med asynch setstate?
                that.setState({
                    game: game,
                });
            } else {
                that.setState({
                    game: '',
                });
            }
        });
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    createPlayer(player) {
        let playerRef = fire.database().ref('/games/' + this.state.game.key + '/players').push();
        player.key = playerRef.key;
        let that = this;
        playerRef.set(player, function (error) {
            if (error) {
                let snack = {
                    variant: "error",
                    message: "Unexpected internal error"
                }
                that.props.showSnackbar(snack);
            }
            else {
                that.setState({
                    playerKey: player.key,
                })

            }
        })
    }

    render() {
        if (!this.state.game.phase) {
            return (
                <div className="page-container play-page">
                    <Grid container spacing={24}>
                        <form autoComplete="off">
                            <FormControl>
                                <TextField
                                    label="Game ID"
                                    name="Game ID"
                                    value={this.state.gameId}
                                    margin="normal"
                                    onChange={this.handleChange('gameId')}
                                />
                            </FormControl>
                            <Button onClick={this.fetchGame} variant="contained">Join</Button>
                        </form>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div className="page-container play-page">
                    {this.state.game.gametype === "quiz" && <Quiz game={this.state.game} createPlayer={this.createPlayer} playerKey={this.state.playerKey} showSnackbar={this.props.showSnackbar} />}
                </div>
            );
        }
    }
}

export default Play;