import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';

class PhaseConnection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            authId: '',
            playerCreated: false,
        };
        this.createPlayer = this.createPlayer.bind(this);
        this.generateName = this.generateName.bind(this);
    }
    componentDidMount() {
        if (this.props.game.quiz.nameGenerator) {
            this.props.addPlayer(this.generatePlayer());
        }
    }
    createPlayer() {
        //validera så att namnet inte är taget.
        let player = {
            name: this.state.name,
            score: 0,

        }
        this.props.addPlayer(player);
        this.setState({ playerCreated: true });
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    generatePlayer() {
        //skriv upp en lista med namn. kanske använda två arrayer en med adjekktiv och en med substantiv "crazy tomato" etc. 
        //använd generateName(this.game.players) den randomar ett namn, kollar om namnet redan finns och randomar igen isåfall.
        //randomar xx antal gånger sen lägger den till ett extra adjektiv
        let name = this.generateName();
        let player = {
            name: name,
            score: 0,
        }
        return player;
    }
    generateName() {
        let adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
        let nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];
        let finalName = "";
        let currentNames = [];
        if (this.props.game.players) {
            currentNames = Object.values(this.props.game.players).map(a => a.name);
        }
        for (let i = 0; i < 20; i++) {
            let name = "";
            if (i > 10) {
                name = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
            } else {
                name = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
            }
            if (currentNames.indexOf(name) > -1) {
                continue;
            } else {
                finalName = name;
                break;
            }
        }
        return finalName;

    }

    render() {
        let players = this.props.game.players;
        let playerName = '';
        if (players && this.props.playerKey) {
            playerName = players[this.props.playerKey].name;
        }
        return (
            <div className="phase-container">
                {playerName &&
                    <Typography variant="h2">Welcome {playerName}! Watch the screen, your name should show.</Typography>
                }
                {!playerName &&
                    <div>
                        <FormControl>
                            <TextField
                                label="Name"
                                name="name"
                                value={this.state.name}
                                margin="normal"
                                onChange={this.handleChange('name')}
                            />
                        </FormControl>
                        <Button onClick={this.createPlayer} variant="contained">done</Button>
                    </div>
                }
            </div>
        );
    }
}

export default PhaseConnection;