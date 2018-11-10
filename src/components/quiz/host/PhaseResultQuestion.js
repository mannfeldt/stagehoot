import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AnswerOption from '../AnswerOption';
import { Typography } from '@material-ui/core';
import AnswerChart from './AnswerChart';
import Leaderboard from './Leaderboard';


class PhaseResultQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.nextQuestion = this.nextQuestion.bind(this);
        this.finalizeQuiz = this.finalizeQuiz.bind(this);
        this.getAnswerData = this.getAnswerData.bind(this);
        this.getTopScorerString = this.getTopScorerString.bind(this);

    }
    //om jag vill försvåra fusk så gömmer jag correctanswer/wronganswers från Play.js och gör rättningen i Host genom att play bara anger vilket svarsalternativ de valt
    //i host när jag kommer hit så rättar jag alla svar och updaterar varje players score
    //play for tillbaka updateringen och visar score och rätt/fel. 
    //

    //alternativet som är mindre säkert men effektivare datamässigt är att play rättar och skriver score, då slipper jag också spara hur snabbt spelaren svarade utan kan göra scoreberäkningen "offline"
    //kör på detta alternativ då det är snabbast att bygga.

    /*
                HostResultQuestion: nu är det dags att börja visa resultat. se över om min datastruktur är hållbar?
med answers, currenq, osv. jag vill ha staplar likt kahootöver hur många som röstade på varje och en top lista över scoresom fylls i lite coolt med animationer
Typräkna upp poängen och ha en horizontel stapel som visualiserar hur mycket någon leder .
i play.js så visas det personliga resultatetsamt sin placering totalt. även där cool animation med score som räknar upp
svg animationer? ettkilomjol stats.js?? skipa chart lib. gör en helt egen komponent som animeras. eller nej ta in chart.js och ha enkel bar chart för result.
correct answer är en vissfärg eller nåt. rita ut siffran på dem. leaderboard rendreras i en componentdör score räknas upp ett i taget,
kolla på javascript för det.kanske ha npgon bakgrund på en div som matchar width till storlek?
leader=100% och alla andra är en bråkdel av leaders score iw idth


strukturera upp denna vy och hostanswer vyn till 3 segment. top middle bottom. top där frågan visas, middle där counter/resultatet visas, bottom där svarsalternativen visas.
använd Grid och vh för att få till detta. kolla kahoot. top 20vh, middle 40vh, bottom 40vh?
lägg till någon färg/symbol på varje svarsalternativ använd index för att styra vilken som får vilket, ha fyra olika designer.
kolla om jag ska använda chart.js för svarsresultatet, finns det någon enkel chart med bara staplarna utan axlar och text? lägg till texten själv? någon annan lib? det ska se ut som kahhot
med siffra för hur många som valde ett alternaiv och markering för vilket som var det rätta.
ha en enkel tabell för leaderboard? men fixa så poängen strömas in. alt en horozontal bar

https://stackoverflow.com/questions/31631354/how-to-display-data-values-on-chart-js
axis.display=false;
detta + rätt färg + en extra symbol på det rätta svaret så är vi hemma!

                                3. fixa finalResultHost: podium.js + leaderboard(?) (tänker mig att podium är en barchart med top 3 eller 10 players?)
                                yaxeln är baserad på totalscore. ovanför eller i baren verticalt så skrivs namnet. score visas också och räknas upp likt answerChart.
                                Det hela är väldigt likt answerChart. informationen som ska visas på varje bar är totalscore, position, playername,
                                Vinnarens namn ska presenteras nedan i större text och med guldkrona? istället för att hålla på med baren.
                                playerPodium visas på playerFinalResult: den innehåller bara en stapel för playern själv och namnet visas inte?
                                finalresult kan även innehålla lite rolig fakta som vem som svarade snabbast, 
                                playerfinalresult kan innehålla en hel tabell där man kan se alla sina svar! 
                                frågenummer, score, time (grön eller röd rad), klickar man på en rad får man se hela frågan med alla alternativ, vilket som var rätt och vilket man själv svarade 
                                5. phaseEndHost: action för restart, create new game, save result(export), 
                                
                                6.phaseEndPlay: thanks for playing, creat your own game here..
                                7. testa ha en "chat" i finalresult/connecting. en ruta där varje Play kan skriva ett meddelande som sedan visas upp i host :)
                                7. kolla på snake. test hur reaktionstiden är i quiz från när play klickar till host skriver ut answers collected:
    */
    nextQuestion() {
        let game = {};
        game.quiz = this.props.game.quiz;
        game.quiz.currentQuestion = game.quiz.currentQuestion + 1;
        game.phase = "awaiting_question";
        this.props.gameFunc.update(game);

    }
    finalizeQuiz() {
        this.props.gameFunc.update({ phase: "final_result" });

    }

    getAnswerData() {
        let answerData = {
            data: [],
            topPlayer: {
                score: 0,
                playerKey: ''
            },
            correctAnswers: [],
        };
        let playerAnswers = [];
        let playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];
        let currentQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
        for (let i = 0; i < playerKeys.length; i++) {
            let player = this.props.game.players[playerKeys[i]];
            if (!player.answers) {
                continue;
            }
            let answer = player.answers[currentQuestion.id];
            if (answer) {

                playerAnswers.push(answer.answer);
                if (answer.score > answerData.topPlayer.score) {
                    answerData.topPlayer.score = answer.score;
                    answerData.topPlayer.playerKey = player.key;
                }
            }
        }
        for (let j = 0; j < currentQuestion.answers.length; j++) {
            let nrOfAnswers = 0;
            for (let i = 0; i < playerAnswers.length; i++) {
                if (currentQuestion.answers.indexOf(playerAnswers[i]) === j) {
                    nrOfAnswers++;
                }
            }
            answerData.data.push(nrOfAnswers);

            if (currentQuestion.correctAnswers.indexOf(currentQuestion.answers[j]) > -1) {
                answerData.correctAnswers.push(j);
            }
        }

        return answerData;
    }
    getTopScorerString() {
        let result = "";
        let answerData = this.getAnswerData();
        if (answerData.topPlayer.score === 0) {
            return null;
        }
        let topPlayer = this.props.game.players[answerData.topPlayer.playerKey];
        result = topPlayer.name + " Scored " + answerData.topPlayer.score + " points!";
        return result;
    }

    render() {
        let answers = [];
        let currentQuestion = "";
        if (this.props.game) {
            currentQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion];
            answers = currentQuestion.answers;
        }
        let nextQuestion = this.props.game.quiz.questions[this.props.game.quiz.currentQuestion + 1];
        let isLastQuestion = typeof nextQuestion === "undefined";
        return (
            <div className="phase-container">
                <div className="quiz-top-section">
                    <Typography variant="h2">{currentQuestion.question}</Typography>
                </div>
                <div className='quiz-middle-section'>
                    <Grid container>
                        <Grid item xs={6}>
                            <div className="quiz-answer-chart">
                                <AnswerChart getAnswerData={this.getAnswerData} />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div>
                                <Leaderboard game={this.props.game} />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                {isLastQuestion && <Button onClick={this.finalizeQuiz}>Finalize result</Button>}
                                {!isLastQuestion && <Button onClick={this.nextQuestion}>Next question</Button>}

                                <Button onClick={this.props.gameFunc.restart}>Restart quiz</Button>
                                <Button onClick={this.props.gameFunc.quit}>Quit quiz</Button>
                                <Button onClick={this.props.gameFunc.end}>End quiz</Button>


                            </div>
                        </Grid>
                    </Grid>
                </div>
                <div className="quiz-bottom-section">
                    <Grid className="align-bottom" container>
                        {answers.map((answer, index) =>
                            <Grid key={index} item xs={6}>
                                <AnswerOption answer={answer} index={index} />
                            </Grid>)}
                    </Grid>
                </div>
            </div >
        );

    }
}

export default PhaseResultQuestion;