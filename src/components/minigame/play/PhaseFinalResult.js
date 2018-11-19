import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
class PhaseFinalResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null
        };
        this.getPlayerAnswerData = this.getPlayerAnswerData.bind(this);
    }
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    getPlayerAnswerData() {
        let answerDataList = [];

        let currentPlayer = this.props.game.players[this.props.playerKey];

        for (let i = 0; i < this.props.game.quiz.questions.length; i++) {
            let answerData = {
                question: {},
                score: 0,
                time: 0,
                answer: '',
            };
            let question = this.props.game.quiz.questions[i];

            if (currentPlayer.answers[question.id]) {
                answerData.score = currentPlayer.answers[question.id].score;
                answerData.answer = currentPlayer.answers[question.id].answer;
                answerData.time = currentPlayer.answers[question.id].answerTime;
            } else {
                answerData.score = 0;
                answerData.answer = "no answer";
                answerData.time = 0;
            }
            answerData.question = question;

            answerDataList.push(answerData);
        }
        return answerDataList;
    }

    render() {

        if (this.props.game.quiz.remoteMode) {
            let playerData = this.getPlayerAnswerData();
            return (<div className="phase-container">
                <div className="quiz-top-section">
                    <Typography variant="h5">Quiz finished</Typography>
                </div>
                <div className='quiz-middle-section'>
                    <Typography variant="subtitle1">You finished
                        <span className="dynamic-text">2nd</span> with a score of  <span className="dynamic-text">560</span>
                    </Typography>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography >Final scoretable</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                podium
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Your own data</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{display:'block'}}>
                            {playerData.map((data, index) =>
                                <ExpansionPanel key={data.question.id} expanded={this.state.expanded === data.question.id} onChange={this.handleChange(data.question.id)}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="subtitle1">{data.question.question}</Typography>
                                        <Typography variant="subtitle2">{data.score}pt</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>Your answer: {data.answer}</Typography>
                                        <Typography>Your time: {data.time/1000}sec</Typography>

                                        <Typography variant="subtitle1" align="left">Correct answers</Typography>
                                        <List>
                                            {data.question.correctAnswers.map((answer, index) =>
                                                <ListItem key={answer}>
                                                    <ListItemText
                                                        primary={answer}
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                        <Typography variant="subtitle1" align="left">Wrong answers</Typography>
                                        <List>
                                            {data.question.wrongAnswers.map((answer, index) =>
                                                <ListItem key={answer}>
                                                    <ListItemText
                                                        primary={answer}
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                </div>
                <div className="quiz-bottom-section">
                </div>
            </div>);
        } else {
            return (
                <div className="phase-container">
                    <div className="quiz-top-section">
                    </div>
                    <div className='quiz-middle-section'>
                        <Typography variant="h5">Look at the screen.</Typography>

                    </div>
                    <div className="quiz-bottom-section">
                    </div>
                </div>
            );
        }
    }
}

export default PhaseFinalResult;