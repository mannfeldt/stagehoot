import React, { Component, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import { fire } from '../../../../base';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  itemtext: {
    paddingLeft: 2,
    paddingRight: 2,
    overflow: 'hidden',
  },
  listitem: {
    paddingLeft: 12,
    paddingRight: 38,
  },
  container: {
    height: '100vh',
    width: '100vw',
  },
  canvas: {
  },
  header: {
    height: 80,
  },
  footer: {
    height: 180,
    marginTop: '-4px',
  },
  clubwrapper: {
    display: 'flex',
    marginTop: '-120px',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  menuitemicon: {
    height: '100%',
    paddingRight: 10,
  },
});


class SpotifyController extends Component {
  constructor(props) {
    super(props);
    // sätt det här till rätt höjd. det ska vara windowheight - header - footer

    this.state = {
      answer: [],


    };
    this.saveAnswer = this.saveAnswer.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
  }

  componentDidMount() {

  }

  // den körs automatiskt när tiden gått ut. finns ingen knapp för att skicka iväg svaren tidigare
  // hur gör jag detta?
  // componentWillUnmount()?
  // jag måste hantera att alla svar inte finns på plats direkt när spotifyResultQuestion kör componentdidmount? lägg in en hård sleep eller så läser jag updates som kommer in där
  // jag gör alla beräkningar på score i render() och jag sparar först score till firebase på nextphase
  componentWillUnmount() {
    const { answer } = this.state;
    if (answer.length > 0) {
      this.saveAnswer();
    }
  }


  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
      anchorEl: null,
    });
  };

  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggleOption(playerKey) {
    this.setState((state) => {
      if (state.answer.includes(playerKey)) {
        return ({
          answer: state.answer.filter(a => a !== playerKey),
        });
      }
      return ({
        answer: [...state.answer, playerKey],
      });
    });
  }

  saveAnswer() {
    const { answer } = this.state;
    const { game, playerKey } = this.props;
    // save answer to game.players[playerkey].answers
    // eller till game.answers ? med ett extra attribut för playerkey. den känns bäst
    const answerObj = {
      answer,
      question: game.minigame.currentq,
      playerKey,
    };
    fire.database().ref(`/games/${game.key}/answers`).push(answerObj, (error) => {
      if (error) {
        alert(`error saving answer${error}`);
      }
    });
    // call firebase here
  }

  // man ska kunna swinga hela tiden men det är bara när player.state är 'STILL' som en boll rendreras och swingen kan sparas.
  // lägg till en selectbox där man väljer klubba som står loftAngle.
  // lägg till en snyggare powermätare. använd någon riktigt visuel mätare
  render() {
    const { classes, game } = this.props;
    const { answer } = this.state;
    const players = Object.values(game.players);
    // skriv ut alla players med namn och avatar (fixa en default avatar till de som inte har någon)
    // man ska kunna klicka på varje player så att den blir vald
    // en multi select typ som matchas mot state.answer
    // de som är med i answer ska stylas som att de är valda.

    // ta bort checkboxen och ersätt med en conditional icon för om den är vald eller inte?
    // den ikonen + bold text + någon border/color runt hela itemet?
    // checkmetoden kollar om itemet finns i answer eller ej. tar bort / lägger till.
    return (
      <div className="phase-container">
        <div className={classes.container}>
          <List dense className={classes.root}>
            <Grid container>
              {players.map(player => (
                <Grid item md={4} xs={6}>
                  <ListItem key={player.key} button onClick={() => this.toggleOption(player.key)} className={classes.listitem}>
                    <ListItemAvatar>
                      <Avatar
                        alt={player.name}
                        src={player.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText className={classes.itemtext} primary={player.name} />
                    <ListItemSecondaryAction>
                      <Checkbox
                        disabled
                        checked={answer.includes(player.key)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </List>
        </div>
      </div>
    );
  }
}
SpotifyController.propTypes = {
  playerKey: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  classes: PropTypes.any,
};
export default withStyles(styles)(SpotifyController);