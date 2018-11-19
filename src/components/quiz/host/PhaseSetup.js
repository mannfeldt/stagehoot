import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
class PhaseSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surveyPlayers: false,
            answerStreak: true,
            nameGenerator: false,
            remoteMode: false,
            useTeams: false,
            randomizeQuestionOrder: false,
            autoPlayQuestions: false,

        };
        this.startGame = this.startGame.bind(this);
        this.createTeamGame = this.createTeamGame.bind(this);
        this.createClassicGame = this.createClassicGame.bind(this);


    }
    handleChangeBool = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    createTeamGame() {
        this.startGame(true);
    }
    createClassicGame() {
        this.startGame(false);
    }
    startGame(teamMode) {
        let game = {};
        let quiz = this.props.game.quiz;
        quiz.surveyPlayers = this.state.surveyPlayers;
        quiz.answerStreak = this.state.answerStreak;
        quiz.nameGenerator = this.state.nameGenerator;
        quiz.remoteMode = this.state.remoteMode;
        quiz.useTeams = teamMode;
        quiz.autoPlayQuestions = this.state.autoPlayQuestions;
        quiz.randomizeQuestionOrder = this.state.randomizeQuestionOrder;
        quiz.currentQuestion = 0;

        game.quiz = quiz;
        game.phase = "connection";
        game.status = "IN_PROGRESS";
        this.props.gameFunc.update(game);
    }

    render() {
        return (
            <div className="phase-container">
                <Typography variant="h4">Game Settings</Typography>
                <Button onClick={this.createClassicGame} variant="contained">Classic</Button>
                <Button onClick={this.createTeamGame} variant="contained">Team mode</Button>

                <FormControl component="fieldset">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.nameGenerator}
                                    onChange={this.handleChangeBool('nameGenerator')}
                                    value="nameGenerator"
                                />
                            }
                            label="Generate names for players"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.remoteMode}
                                    onChange={this.handleChangeBool('remoteMode')}
                                    value="remoteMode"
                                />
                            }
                            label="Remote playmode"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.answerStreak}
                                    onChange={this.handleChangeBool('answerStreak')}
                                    value="answerStreak"
                                />
                            }
                            label="Use answer scorestreak"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.surveyPlayers}
                                    onChange={this.handleChangeBool('surveyPlayers')}
                                    value="surveyPlayers"
                                />
                            }
                            label="Survey players after game"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.randomizeQuestionOrder}
                                    onChange={this.handleChangeBool('randomizeQuestionOrder')}
                                    value="randomizeQuestionOrder"
                                />
                            }
                            label="Randomize question order"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.autoPlayQuestions}
                                    onChange={this.handleChangeBool('autoPlayQuestions')}
                                    value="autoPlayQuestions"
                                />
                            }
                            label="Auto play questions"
                        />

                    </FormGroup>
                </FormControl>
            </div>
        );
    }
}

export default PhaseSetup;