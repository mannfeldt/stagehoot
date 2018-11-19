import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class PhaseSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surveyPlayers: false,
            nameGenerator: false,
            useTeams: false,
        };
        this.startGame = this.startGame.bind(this);
        this.createTeamGame = this.createTeamGame.bind(this);
        this.createClassicGame = this.createClassicGame.bind(this);


    }
    handleChangeBool = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    createTeamGame() {
        this.startGame(true);
    }
    createClassicGame() {
        this.startGame(false);
    }
    startGame(teamMode) {
        let game = {};
        let minigame = this.props.game.minigame;
        minigame.surveyPlayers = this.state.surveyPlayers;
        minigame.nameGenerator = this.state.nameGenerator;
        minigame.useTeams = teamMode;
        game.minigame = minigame;
        game.phase = "connection";
        game.status = "IN_PROGRESS";
        this.props.gameFunc.update(game);
    }

    render() {
        return (
            <div className="phase-container">
                <Typography variant="h4">Game Settings</Typography>
                <Button onClick={this.createClassicGame} variant="contained">Classic</Button>
                <Button onClick={this.createTeamGame} variant="contained">Team mode</Button>
                <FormControl component="fieldset">
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.nameGenerator}
                                    onChange={this.handleChangeBool('nameGenerator')}
                                    value="nameGenerator"
                                />
                            }
                            label="Generate names for players"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.surveyPlayers}
                                    onChange={this.handleChangeBool('surveyPlayers')}
                                    value="surveyPlayers"
                                />
                            }
                            label="Survey players after game"
                        />
                    </FormGroup>
                </FormControl>
            </div>
        );
    }
}

export default PhaseSetup;