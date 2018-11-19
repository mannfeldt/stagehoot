import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class CreateSnake extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            gametype: 'snake',
            gamemode: 'survival',
            walls: true,
            gameid: '',
            gamePass: '',
        };

        this.validateGame = this.validateGame.bind(this);
        this.createGame = this.createGame.bind(this);

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

    createGame() {
        let game = {};
        game = {
            password: this.state.gamePass,
            gametype: this.state.gametype,
            tile: this.state.title,
            minigame: {
                gamemode: this.state.gamemode,
                useWalls: this.state.walls,
            }
        };
        this.props.createGame(game);
    }
    validateGame(game) {
        //validera lösenord är tillräckligt starkt här eller direkt efter input om det finns någon smart lösning.
        //kolla på gametype hur ha en secifik validering för varje type
        return true;

    }
    clearForm() {

    }

    render() {
        return (
            <div className="app-page create-page">
                <Grid container spacing={8}>
                    <form autoComplete="off">
                        <Grid item xs={4}>
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

                            <FormControl component="fieldset">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.walls}
                                            onChange={this.handleChangeBool('walls')}
                                            value="walls"
                                        />
                                    }
                                    label="Use walls"
                                />
                            </FormControl>

                            <FormControl>
                                <TextField
                                    label="Title"
                                    name="title"
                                    value={this.state.title}
                                    margin="normal"
                                    onChange={this.handleChange('title')}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    label="Password"
                                    type="password"
                                    name="gamePass"
                                    margin="normal"
                                    value={this.state.gamePass}
                                    onChange={this.handleChange('gamePass')}
                                />
                            </FormControl>

                            <Button onClick={this.createGame} variant="contained">Create</Button>
                        </Grid>
                    </form>

                </Grid>
            </div >
        );
    }
}

export default CreateSnake;