import React, { Component } from 'react';
import { fire } from '../../base';
import QuestionForm from './QuestionForm';
import Question from './Question';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            gametype: 'quiz',
            gamemode: 'normal',
            timelimit: true,
            timescore: false,
            questions: [],
            gameid: '',
            gamePass: '',
        };
        this.addQuestion = this.addQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.validateGame = this.validateGame.bind(this);
        this.createQuiz = this.createQuiz.bind(this);

    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    handleChangeBool = name => event => {
        this.setState({ [name]: event.target.checked });
    };
    handleChangeSelect = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    addQuestion(question) {
        let questions = this.state.questions;
        if(questions.length===0){
            question.id = 1;
        }else{
            //räknar ut ett id som det nuvarande högsta id+1. Kan då använda id både som unik identifierare och som index
            question.id = Math.max.apply(Math, questions.map(function(o) { return o.id; })) +1;
        }
        questions.push(question);
        this.setState({
            questions: questions
        });
        let snack = {
            variant: "success",
            message: "Added question"
        }
        this.props.showSnackbar(snack);
    }
    deleteQuestion(question) {
        let questions = this.state.questions;
        const index = questions.map(e => e.id).indexOf(question.id);
        questions.splice(index, 1);
        this.setState({
            questions: questions
        });
    }
    createQuiz() {
        let game = {};
        game = {
            password: this.state.gamePass,
            gametype: this.state.gametype,
            tile: this.state.title,
            quiz: {
                gamemode: 'normal',
                timelimit: this.state.timelimit,
                timescore: this.state.timescore,
                questions: this.state.questions,
            }
        };
        this.props.createQuiz(game);
    }
    validateGame(game) {
        //validera lösenord är tillräckligt starkt här eller direkt efter input om det finns någon smart lösning.
        //kolla på gametype hur ha en secifik validering för varje type
        return true;

    }
    clearForm() {

    }

    render() {
        return (
            <div className="app-page create-page">
                <Grid container spacing={24}>
                    <form autoComplete="off">
                        <FormControl required >
                            <InputLabel htmlFor="gametype-required">Gametype</InputLabel>
                            <Select
                                value={this.state.gametype || ""}
                                onChange={this.handleChangeSelect}
                                name="gametype"
                                inputProps={{
                                    id: 'gametype-required',
                                }}
                            >
                                <MenuItem value={"quiz"}>Quiz</MenuItem>
                                <MenuItem value={"survey"}>Survey</MenuItem>
                                <MenuItem value={"discussion"}>Discussion</MenuItem>
                                <MenuItem value={"minigame"}>Mini game</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl required >
                            <InputLabel htmlFor="gametype-required">Gamemode</InputLabel>
                            <Select
                                value={this.state.gamemode || ""}
                                onChange={this.handleChangeSelect}
                                name="gamemode"
                                inputProps={{
                                    id: 'gamemode-required',
                                }}
                            >
                                <MenuItem value={"normal"}>Normal</MenuItem>
                                <MenuItem value={"wild"}>Wild</MenuItem>

                            </Select>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Game options</FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.timelimit}
                                            onChange={this.handleChangeBool('timelimit')}
                                            value="timelimit"
                                        />
                                    }
                                    label="Time limited questions"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.timescore}
                                            onChange={this.handleChangeBool('timescore')}
                                            value="timescore"
                                        />
                                    }
                                    label="Time based score"
                                />
                            </FormGroup>
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Title"
                                name="title"
                                value={this.state.title}
                                margin="normal"
                                onChange={this.handleChange('title')}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                label="Password"
                                type="password"
                                name="gamePass"
                                margin="normal"
                                value={this.state.gamePass}
                                onChange={this.handleChange('gamePass')}
                            />
                        </FormControl>
                        <Button onClick={this.createQuiz} variant="contained">Create</Button>
                    </form>
                    <QuestionForm addQuestion={this.addQuestion} isTimelimit={!!this.state.timelimit} />
                    {this.state.questions.map((question, index) =>
                        <Question key={question.id} question={question} transitionDelay={index} deleteQuestion={this.deleteQuestion} />
                    )}
                </Grid>
            </div>
        );
    }
}

export default Create;