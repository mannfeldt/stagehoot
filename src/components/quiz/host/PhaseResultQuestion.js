import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import AnswerOption from '../AnswerOption';
import AnswerChart from '../AnswerChart';
import Leaderboard from '../Leaderboard';


class PhaseResultQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.nextQuestion = this.nextQuestion.bind(this);
    this.finalizeQuiz = this.finalizeQuiz.bind(this);
  }

  nextQuestion() {
    const game = {};
    game.quiz = this.props.game.quiz;
    game.quiz.currentQuestion = game.quiz.currentQuestion + 1;
    game.phase = 'awaiting_question';
    this.props.gameFunc.update(game);
  }

  finalizeQuiz() {
    this.props.gameFunc.update({ phase: 'final_result' });
  }

  render() {
    let answers = [];
    let currentQuestion = '';
    if (this.props.game) {
      currentQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
      answers = currentQuestion.answers;
    }
    const nextQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion + 1];
    const isLastQuestion = typeof nextQuestion === 'undefined';
    return (
      <div className="phase-container">
        <div className="quiz-top-section">
          <Typography variant="h6" style={{ float: 'right' }}>{`Game PIN:${this.props.game.gameId} `}</Typography>
          <Typography variant="h5">{currentQuestion.question}</Typography>
        </div>
        <div className="quiz-middle-section">
          <Grid container>
            <Grid item md={6} xs={12}>
              <div className="quiz-answer-chart">
                <AnswerChart game={this.props.game} />
              </div>
            </Grid>
            <Grid item md={6} xs={12}>
              <div>
                <Leaderboard game={this.props.game} />
              </div>
            </Grid>
          </Grid>
          <div>
            {isLastQuestion && <Button onClick={this.finalizeQuiz}>Finalize result</Button>}
            {!isLastQuestion && <Button onClick={this.nextQuestion}>Next question</Button>}
            <Button onClick={this.props.gameFunc.restart}>Restart quiz</Button>
            <Button onClick={this.props.gameFunc.quit}>Quit quiz</Button>
            <Button onClick={this.props.gameFunc.end}>End quiz</Button>
          </div>
        </div>
        <div className="quiz-bottom-section">
          <Grid className="align-bottom" container>
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

export default PhaseResultQuestion;
