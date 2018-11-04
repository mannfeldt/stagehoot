import React, { Component } from 'react';
import { fire } from '../../../base';
import Button from '@material-ui/core/Button';

class HostResultQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.nextQuestion = this.nextQuestion.bind(this);
        this.finalizeQuiz = this.finalizeQuiz.bind(this);
    }
    //om jag vill försvåra fusk så gömmer jag correctanswer/wronganswers från Play.js och gör rättningen i Host genom att play bara anger vilket svarsalternativ de valt
    //i host när jag kommer hit så rättar jag alla svar och updaterar varje players score
    //play for tillbaka updateringen och visar score och rätt/fel. 

    //alternativet som är mindre säkert men effektivare datamässigt är att play rättar och skriver score, då slipper jag också spara hur snabbt spelaren svarade utan kan göra scoreberäkningen "offline"
    //kör på detta alternativ då det är snabbast att bygga.
    nextQuestion() {
        let game = {};
        game.quiz = this.props.game.quiz;
        game.quiz.currentQuestion = game.quiz.currentQuestion + 1;
        game.phase = "awaiting_question";
        this.props.updateGame(game);

    }
    finalizeQuiz() {
        this.props.updateGame({ phase: "final_result" });

    }
    render() {
        //kolla om currentQuestion är den sista frågan, isåfall så rendrera en knapp "finalizeQuiz" isteället för nextQuestion 
        let nextQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion + 1];
        let isLastQuestion = typeof nextQuestion === "undefined";
        if (isLastQuestion) {
            return (
                <div className="phase-container">
                    HostResultQuestion
                    <Button onClick={this.finalizeQuiz}>Finalize result</Button>

                </div>
            );
        } else {
            return (
                <div className="phase-container">
                    HostResultQuestion: nu är det dags att börja visa resultat. se över om min datastruktur är hållbar?
                    med answers, currenq, osv. jag vill ha staplar likt kahootöver hur många som röstade på varje och en top lista över scoresom fylls i lite coolt med animationerTypräkna upp poängen och ha en horizontel stapel som visualiserar hur mycket någon leder .
                    i play.js så visas det personliga resultatetsamt sin placering totalt. även där cool animation med score som räknar upp
                <Button onClick={this.nextQuestion}>Next question</Button>

                </div>
            );
        }

    }
}

export default HostResultQuestion;