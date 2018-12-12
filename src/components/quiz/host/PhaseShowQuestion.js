import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class PhaseShowQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
    };
    this.nextPhase = this.nextPhase.bind(this);
  }

  componentDidMount() {
    const question = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
    this.setState({ question });
    const phaseTime = 3000 + (question.question.length * 20);
    setTimeout(this.nextPhase, phaseTime);
  }

  nextPhase() {
    let answers = [];
    if (this.state.question.aType === 'multiple') {
      answers = this.state.question.wrongAnswers.concat(this.state.question.correctAnswers);
      answers = this.shuffle(answers);
    } else if (this.state.question.aType === 'boolean') {
      answers = ['True', 'False'];
    }
    if (answers.length) {
      const game = {};
      game.phase = 'answer';
      game.quiz = this.props.game.quiz;
      game.quiz.questions[game.quiz.currentQuestion].answers = answers;
      this.props.gameFunc.update(game);
    } else {
      this.props.gameFunc.update({ phase: 'answer' });
    }
  }

  shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
      const index = Math.floor(Math.random() * counter);
      counter--;
      const temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  render() {
    return (
          <div className="phase-container">
              <div className="quiz-top-section">
                  <Typography variant="h2">{this.state.question.question}</Typography>

                </div>
              <div className="quiz-middle-section" />
              <div className="quiz-bottom-section" />
            </div>
    );
  }
}

export default PhaseShowQuestion;
