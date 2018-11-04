import React, { Component } from 'react';
import { fire } from '../../base';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import PlayConnection from '../play/PlayConnection';
import PlayStarting from '../play/PlayStarting';
import PlayAwaitingQuestion from '../play/quiz/PlayAwaitingQuestion';
import PlayShowQuestion from '../play/quiz/PlayShowQuestion';
import PlayAnswer from '../play/quiz/PlayAnswer';
import PlayFinalResult from '../play/PlayFinalResult';
import PlayResultQuestion from '../play/quiz/PlayResultQuestion';
import PlayEnd from '../play/PlayEnd';
class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {},
            gameId: '',
            player: '',

        };
        this.updatePlayer = this.updatePlayer.bind(this);
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
    updatePlayer(player) {
        let that = this;
        //kolla om den är player.isNew isåfall gör en push/set
        fire.database().ref('/games/' + that.state.game.key + '/players/' + player.key).update(player, function (error) {
            if (error) {
                let snack = {
                    variant: "error",
                    message: "Unexpected internal error"
                }
                that.props.showSnackbar(snack);
            }
            else {
                let snack = {
                    variant: "success",
                    message: "Successfully updated player!"
                }
                that.props.showSnackbar(snack);
            }
        })
    }
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
                    player: player.key,
                })

            }
        })
    }

    render() {
        //behöver bara updatera phase till firebase när det är phases som play bryr sig om. t.ex. "connection" "answer" "result_question" "final_result" "end"
        //lägg till två rutor här för att söka fram ett game med hjälp av gameid och pass.

        //i connection så skapas playerobjektet och skickas till addPlayer()

        //connection shows input for creating new player and when thats done it shows static view awaiting new phase
        //starting shows static view awaiting new phase
        //awaiting_question shows static view awaiting new phase
        //show_question shows static view "look at host" awaitng new phase
        //answer shows answerboxes and when player has answered shows static text awaiting new phase
        //result_question shows result from last question and awaits new phase
        //final _result shows result for player for whole quiz, placement in competition etc, awaiting new phase
        //end shows options to create a own game and maybe a survey about this game. also still shows your score but a bit minimal
        return (
            <div className="page-container play-page">
                {!this.state.game.phase &&
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
                }
                {this.state.game.phase === "connection" && <PlayConnection game={this.state.game} addPlayer={this.createPlayer} playerKey={this.state.player} />}
                {this.state.game.phase === "starting" && <PlayStarting game={this.state.game} updatePlayer={this.updatePlayer} />}
                {this.state.game.phase === "awaiting_question" && <PlayAwaitingQuestion game={this.state.game} updatePlayer={this.updatePlayer} />}
                {this.state.game.phase === "show_question" && <PlayShowQuestion game={this.state.game} updatePlayer={this.updatePlayer} />}
                {this.state.game.phase === "answer" && <PlayAnswer game={this.state.game} updatePlayer={this.updatePlayer} playerKey={this.state.player} />}
                {this.state.game.phase === "result_question" && <PlayResultQuestion game={this.state.game} updatePlayer={this.updatePlayer} playerKey={this.state.player} />}
                {this.state.game.phase === "final_result" && <PlayFinalResult game={this.state.game} updatePlayer={this.updatePlayer} playerKey={this.state.player} />}
                {this.state.game.phase === "end" && <PlayEnd game={this.state.game} updatePlayer={this.updatePlayer} playerKey={this.state.player} />}
            </div>
        );
    }
}

export default Play;