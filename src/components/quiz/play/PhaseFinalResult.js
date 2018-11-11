import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Podium from '../Podium';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class PhaseFinalResult extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        if (this.props.game.quiz.remoteMode) {
            return (<div className="phase-container">
                <div className="quiz-top-section">
                    <Typography variant="h3">Quiz finished.</Typography>
                </div>
                <div className='quiz-middle-section'>
                    <Typography variant="caption">You finished 2nd with a score of 560</Typography>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography >Final scoretable</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Podium game={this.props.game} />
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Your own data</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                här ska jag ha en lista med cards.?
                                eller en tabell.

                                En tabell som har kolumnerna:
                                frågenummer, score, time (grön eller röd rad), klickar man på en rad får man se hela frågan med alla alternativ, vilket som var rätt och vilket man själv svarade,
                                antingen visas den detaljerade informationen i en expanstionunder raden eller i en dialog.


                            </Typography>
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
                        <Typography variant="h3">Look at the screen.</Typography>

                    </div>
                    <div className="quiz-bottom-section">
                    </div>
                </div>
            );
        }
    }
}

export default PhaseFinalResult;