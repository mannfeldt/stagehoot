import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

class PhaseShowQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        if (this.props.game.quiz.remoteMode) {
            return (
                <div className="phase-container">
                    <div className="quiz-top-section">
                    </div>
                    <div className='quiz-middle-section'>
                        <Typography variant="h5">{this.props.game.quiz.questions[this.props.game.quiz.currentQuestion].question}</Typography>
                    </div>
                    <div className="quiz-bottom-section">
                    </div>
                </div>
            );
        } else {
            return (
                <div className="phase-container">
                    <div className="quiz-top-section">
                    </div>
                    <div className='quiz-middle-section'>
                        <Typography variant="h5">Look at the question on the screen!</Typography>
                    </div>
                    <div className="quiz-bottom-section">
                    </div>
                </div>
            );
        }
    }
}

export default PhaseShowQuestion;