import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GenerateQuizForm from './GenerateQuizForm';

class QuestionForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: '',
            correctAnswer: '',
            wrongAnswerOne: '',
            wrongAnswerTwo: '',
            wrongAnswerThree: '',
            timelimit: '10',
            qType: 'text',
            aType: 'multiple',
            answerBool: '',
            generateQuestions: true,

        };
        this.sendQuestion = this.sendQuestion.bind(this);
        this.toggleGenerateQuestion = this.toggleGenerateQuestion.bind(this);

    }
    sendQuestion() {
        let question = {
            question: this.state.question,
            correctAnswers: [this.state.correctAnswer],
            wrongAnswers: [this.state.wrongAnswerOne, this.state.wrongAnswerTwo, this.state.wrongAnswerThree],
            timelimit: this.state.timelimit,
            qType: this.state.qType,
            aType: this.state.aType,
        };
        this.setState({
            question: '',
            correctAnswer: '',
            wrongAnswerOne: '',
            wrongAnswerTwo: '',
            wrongAnswerThree: '',
        });
        this.props.addQuestion(question);
    }
    toggleGenerateQuestion(){
        this.setState({
            generateQuestions: !this.state.generateQuestions
        });
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    handleTrueFalse = event => {
        let answer = event.target.value;
        this.setState({
            correctAnswer: answer,
            wrongAnswerOne: answer === "true" ? 'false' : 'true',
        });
    };
    handleChangeSelect = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        if (this.state.generateQuestions) {
            return (
                <div>
                    <Button onClick={this.toggleGenerateQuestion} variant="contained">Custom questions</Button>
                    <GenerateQuizForm addQuestions={this.props.addQuestions} showSnackbar={this.props.showSnackbar} />
                </div >
            );
        } else {
            return (
                <div>
                    <Button onClick={this.toggleGenerateQuestion} variant="contained">Auto generate questions</Button>

                    <FormControl required >
                        <InputLabel htmlFor="qtype-required">Question type</InputLabel>
                        <Select
                            value={this.state.qType || ""}
                            onChange={this.handleChangeSelect}
                            name="qtype"
                            inputProps={{
                                id: 'qtype-required',
                            }}
                        >
                            <MenuItem value={"text"}>Text</MenuItem>
                            <MenuItem value={"image"}>Image</MenuItem>
                            <MenuItem value={"video"}>Video</MenuItem>

                        </Select>
                    </FormControl>
                    <FormControl required >
                        <InputLabel htmlFor="aType-required">Answer type</InputLabel>
                        <Select
                            value={this.state.aType || ""}
                            onChange={this.handleChangeSelect}
                            name="aType"
                            inputProps={{
                                id: 'aType-required',
                            }}
                        >
                            <MenuItem value={"boolean"}>True/false</MenuItem>
                            <MenuItem value={"player"}>Player</MenuItem>
                            <MenuItem value={"multiple"}>Mulitichoice</MenuItem>
                            <MenuItem value={"free"}>Free text</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <TextField
                            label="Question"
                            name="question"
                            value={this.state.question}
                            margin="normal"
                            onChange={this.handleChange('question')}
                        />
                    </FormControl>
                    {this.state.aType === "multiple" &&
                        <div>
                            <FormControl>
                                <TextField
                                    label="Correct answer"
                                    name="correctAnswer"
                                    margin="normal"
                                    value={this.state.correctAnswer}
                                    onChange={this.handleChange('correctAnswer')}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    label="Wrong answer"
                                    name="wrongAnswerOne"
                                    margin="normal"
                                    value={this.state.wrongAnswerOne}
                                    onChange={this.handleChange('wrongAnswerOne')}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    label="Wrong answer"
                                    name="wrongAnswerTwo"
                                    margin="normal"
                                    value={this.state.wrongAnswerTwo}
                                    onChange={this.handleChange('wrongAnswerTwo')}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    label="Wrong answer"
                                    name="wrongAnswerThree"
                                    margin="normal"
                                    value={this.state.wrongAnswerThree}
                                    onChange={this.handleChange('wrongAnswerThree')}
                                />
                            </FormControl>
                        </div>
                    }
                    {this.state.aType === "boolean" &&
                        <div>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Answer</FormLabel>
                                <RadioGroup
                                    aria-label="answer"
                                    name="correctAnswer"
                                    value={this.state.correctAnswer}
                                    onChange={this.handleTrueFalse}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="True" />
                                    <FormControlLabel value="false" control={<Radio />} label="False" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                    }
                    {this.props.isTimelimit &&
                        <FormControl>
                            <TextField
                                label="Time limit"
                                name="timelimit"
                                type="number"
                                value={this.state.timelimit}
                                margin="normal"
                                onChange={this.handleChange('timelimit')}
                            />
                        </FormControl>
                    }
                    <Button onClick={this.sendQuestion} variant="contained">Add question</Button>
                </div >
            );
        }
    }
}

export default QuestionForm;