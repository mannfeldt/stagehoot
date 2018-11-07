import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class HostShowQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
        }
        this.nextPhase = this.nextPhase.bind(this);
    }
    componentDidMount() {
        let question = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
        this.setState({ question })
        let phaseTime = 3000 + (question.question.length * 20);
        setTimeout(this.nextPhase, phaseTime);
    }
    nextPhase() {
        let answers = [];
        if (this.state.question.aType === 'multiple' || this.state.question.aType === 'boolean') {
            answers = this.state.question.wrongAnswers.concat(this.state.question.correctAnswers);
            answers = this.shuffle(answers);
        }
        if(answers.length){
            let game = {};
            game.phase = "answer";
            game.quiz = this.props.game.quiz;
            game.quiz.questions[game.quiz.currentQuestion].answers = answers;
            this.props.updateGame(game);

        }else{
            this.props.updateGame({ phase: "answer" });
        }
    }
    shuffle(array) {
        let counter = array.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    render() {
        return (
            <div className="phase-container">
                <Typography variant="h2">{this.state.question.question}</Typography>
            </div>
        );
    }
}

export default HostShowQuestion;