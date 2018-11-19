import React, { Component } from 'react';
import { fire } from '../../base';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Quiz from '../quiz/host/Quiz';
import Minigame from '../minigame/host/Minigame';

class Host extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {},
            gameId: localStorage.getItem('RecentGameId') || '',
            password: '',

        };
        this.updateGame = this.updateGame.bind(this);
        this.fetchGame = this.fetchGame.bind(this);
        this.initGameListiner = this.initGameListiner.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.quitGame = this.quitGame.bind(this);
        this.endGame = this.endGame.bind(this);
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    updateGame(game) {
        let that = this;
        //se till att inte updatera game.players...
        //game som kommer in här ska bara innehålla det som ska uppdateras.
        //updateras med gamesettings, phasechanges, currenquestionId etc
        fire.database().ref('games/' + that.state.game.key).update(game, function (error) {
            if (error) {
                let snack = {
                    variant: "error",
                    message: "Unexpected internal error"
                }
                that.props.showSnackbar(snack);
            }
            else {
            }
        })
    }
    restartGame(){
       let game = {};
        game.players = [];
       game.phase = "setup";
       this.updateGame(game);
    }

    quitGame(){
        this.updateGame({phase: null});
        this.props.toggleHeader(true);


    }
    endGame(){
        this.updateGame({phase: "final_result"});
    }


    fetchGame() {
        let that = this;
        fire.database().ref('games').orderByChild("gameId").equalTo(that.state.gameId).once("value", function (snapshot) {
            if (snapshot.val()) {
                let game;
                snapshot.forEach(function (child) {
                    game = child.val();
                });
                if (game.password === that.state.password) {
                    that.initGameListiner(game.key);
                    that.props.toggleHeader();
                } else {
                    let snack = {
                        variant: "error",
                        message: "Could not find matching game"
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
        //koppla this.state.game till gameKey
        //lägg till en likadan listener i Play.
        //hosts gamelistiner ska lyssna på alla ändringar. Play ska inte lyssna på andra players ändringar om det går. något att optimera i framtiden.
        //ett alt är att lyfta ut Players till en egen root? kan lägga phase och currentq i en game.state och sen är det allt som Player lyssnar på?
        //men play behöver också behöva synca sin egna player.
    }
    render() {
        //behöver bara updatera phase till firebase när det är phases som play bryr sig om. t.ex. inte setup då play bara kan connecta till games som är i phase==connection
        //lägg till två rutor här för att söka fram ett game med hjälp av gameid och pass.

        //strukturera filerna för host och play. kommentera i varje fil vad syftet med den är. vad den ska updatera i game etc. 
        //HostSetup updates settings and sets phase to connection on action
        //connection shows players and sets phase to starting on action
        //starting shows a countdown sets phase to awating_question and currentQuestion to 0(or some id) after countdown
        //awaiting_question shows countdown and sets phase to show question after countdown
        //show_question shows question and sets phase to answer after countdown
        //answer shows q&a, countdown, nrPlayersAnswered, sets phase to result_question after countdown
        //result_question shows stats about the answers, correct answer, hightscorelist etc, sets phase to awaiting_question and currentQuestion++ on action.
        //result_question sets phase to final_result if questions are all done.
        //final_result shows result of all players. top 3 and/or all. sets phase to end on action
        //end shows options for replay, export result, etc.
        let gameFunctions = {
            update: this.updateGame,
            restart: this.restartGame,
            end: this.endGame,
            quit: this.quitGame,
        }
        if (!this.state.game.phase) {
            return (
                <div className="page-container host-page">
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
                            <FormControl>
                                <TextField
                                    label="Password"
                                    type="password"
                                    name="password"
                                    margin="normal"
                                    value={this.state.password}
                                    onChange={this.handleChange('password')}
                                />
                            </FormControl>
                            <Button onClick={this.fetchGame} variant="contained">Fetch</Button>
                        </form>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div className="page-container host-page">
                    {this.state.game.gametype === "quiz" && <Quiz game={this.state.game} gameFunc={gameFunctions} />}
                    {this.state.game.gametype === "snake" && <Minigame game={this.state.game} gameFunc={gameFunctions} />}
                    {this.state.game.gametype === "tetris" && <Minigame game={this.state.game} gameFunc={gameFunctions} />}


                </div>
            );
        }
    }
}

export default Host;