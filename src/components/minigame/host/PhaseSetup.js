import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';

class PhaseSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surveyPlayers: false,
            nameGenerator: false,
            gamemode: this.props.game.minigame.gamemode,
            racetarget: this.props.game.minigame.racetarget,
            opponentCollision: this.props.game.minigame.opponentCollision,
            eatOpponents: this.props.game.minigame.eatOpponents,
            wallCollision: this.props.game.minigame.wallCollision,
            difficulty: this.props.game.minigame.difficulty,
        };
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    handleChangeBool = name => event => {
        this.setState({ [name]: event.target.checked });
    };
    handleChangeSelect = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    startGame = multiplayerMode => {
        let game = {};
        let minigame = this.props.game.minigame;
        minigame.surveyPlayers = this.state.surveyPlayers;
        minigame.nameGenerator = this.state.nameGenerator;
        minigame.multiplayerMode = multiplayerMode;
        minigame.wallCollision = this.state.wallCollision;
        minigame.opponentCollision = this.state.opponentCollision;
        minigame.eatOpponents = this.state.opponentCollision && this.state.eatOpponents;
        minigame.racetarget = this.state.racetarget;
        minigame.difficulty = this.state.difficulty;
        minigame.gamemode = this.state.gamemode;


        game.minigame = minigame;
        game.phase = "connection";
        game.status = "IN_PROGRESS";
        this.props.gameFunc.update(game);
    };


    render() {
        return (
            <div className="phase-container">
                <Typography variant="h4">Game Settings</Typography>
                <Button onClick={() => this.startGame('classic')} variant="contained">Classic</Button>
                <Button onClick={() => this.startGame('coop')} variant="contained">Co-op multiplayer</Button>
                <Button onClick={() => this.startGame('team')} variant="contained">Team multiplayer</Button>
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
                        <FormControl required >
                            <InputLabel htmlFor="gametype-required">Game mode</InputLabel>
                            <Select
                                value={this.state.gamemode || ""}
                                onChange={this.handleChangeSelect}
                                name="gamemode"
                                inputProps={{
                                    id: 'gamemode-required',
                                }}
                            >
                                <MenuItem value={"survival"}>Survival</MenuItem>
                                <MenuItem value={"race"}>Race</MenuItem>

                            </Select>
                        </FormControl>

                        {this.props.gamemode === "race" &&
                            <FormControl>
                                <TextField
                                    label="Snake length"
                                    name="racetarget"
                                    type="number"
                                    value={this.state.racetarget}
                                    margin="normal"
                                    onChange={this.handleChange('racetarget')}
                                />
                            </FormControl>
                        }
                        <FormControl required >
                            <InputLabel htmlFor="gametype-required">difficulty</InputLabel>
                            <Select
                                value={this.state.difficulty || ""}
                                onChange={this.handleChangeSelect}
                                name="difficulty"
                                inputProps={{
                                    id: 'difficulty-required',
                                }}
                            >
                                <MenuItem value={"500"}>Easy</MenuItem>
                                <MenuItem value={"300"}>Medium</MenuItem>
                                <MenuItem value={"100"}>Hard</MenuItem>
                                <MenuItem value={"75"}>Pro</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.wallCollision}
                                        onChange={this.handleChangeBool('wallCollision')}
                                        value="wallCollision"
                                    />
                                }
                                label="Wall collisions"
                            />
                        </FormControl>

                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.opponentCollision}
                                        onChange={this.handleChangeBool('opponentCollision')}
                                        value="opponentCollision"
                                    />
                                }
                                label="Opponent collisions"
                            />
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.opponentCollision && this.state.eatOpponents}
                                        disabled={!this.state.opponentCollision}
                                        onChange={this.handleChangeBool('eatOpponents')}
                                        value="eatOpponents"
                                    />
                                }
                                label="Eat opponent on collision"
                            />
                        </FormControl>
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