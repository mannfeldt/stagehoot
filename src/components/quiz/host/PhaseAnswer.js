import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AnswerOption from '../AnswerOption';
import Timer from '../../common/Timer';
import AnswerCounter from './AnswerCounter';

class PhaseAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: null,
      timelimit: 0,
      started: false,
      isTimelimited: true,
      question: {
        question: '',
        answers: [],
      },
    };
    this.nextPhase = this.nextPhase.bind(this);
  }

  componentDidMount() {
    const that = this;
    const question = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
    this.setState({ question, isTimelimited: this.props.game.quiz.timelimit, timelimit: question.timelimit * 10 });
    if (this.props.game.quiz.timelimit) {
      const playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];
      let counter = question.timelimit * 10;
      const i = setInterval(() => {
        let answersCollected = 0;
        for (let i = 0; i < playerKeys.length; i++) {
          if (that.props.game.players[playerKeys[i]].answers && that.props.game.players[playerKeys[i]].answers[question.id]) {
            answersCollected++;
          }
        }
        counter--;
        that.setState({ counter, started: true });
        if (counter <= -5 || answersCollected === playerKeys.length) {
          that.nextPhase();
          clearInterval(i);
        }
      }, 100);
    }
  }

  nextPhase() {
    this.props.gameFunc.update({ phase: 'result_question' });
  }

  render() {
    let answers = [];
    if (this.props.game) {
      answers = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].answers;
    }
    let answersCollected = 0;
    const playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];
    for (let i = 0; i < playerKeys.length; i++) {
      if (this.props.game.players[playerKeys[i]].answers && this.props.game.players[playerKeys[i]].answers[this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].id]) {
        answersCollected++;
      }
    }
    const answerCollectedPercentage = (answersCollected / playerKeys.length) * 100;
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Typography variant="h2">{this.state.question.question}</Typography>
        </div>
        <div className="quiz-middle-section">
          {!this.state.isTimelimited && <Button onClick={this.nextPhase}>Next</Button>}
          {this.state.isTimelimited && <Timer startValue={this.state.timelimit} value={this.state.counter} text={Math.ceil(this.state.counter / 10)} />
                    }
          <div className="quiz-answercounter-container">
            <AnswerCounter value={answerCollectedPercentage} />
          </div>

        </div>
        <div className="quiz-bottom-section">

          <Grid container className="align-bottom">
            {answers.map((answer, index) => (
              <Grid key={index} item xs={6}>
                <AnswerOption answer={answer} index={index} />
              </Grid>
            ))}
          </Grid>
        </div>

      </div>
    );
  }
}

export default PhaseAnswer;
