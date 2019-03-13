import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
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
import PersonIcon from '@material-ui/icons/Person';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { fire } from '../../../../base';

const styles = theme => ({
  root: {
    width: '100%',
  },
  itemtext: {
    overflow: 'hidden',
  },
  header: {
    padding: 10,
  },
  itemtextDense: {
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
  headcontainer: {
    backgroundColor: '#282828',
    marginBottom: 10,
  },
});

class SpotifyController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: ['default'],
      searchInput: '',
      showSearch: false,
    };
    this.saveAnswer = this.saveAnswer.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.saveAnswer();
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  toggleSearch = () => {
    this.setState(state => ({
      showSearch: !state.showSearch,
      searchInput: '',
    }));
  }

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
  }

  render() {
    const { classes, game } = this.props;
    const { answer, searchInput, showSearch } = this.state;
    const players = Object.values(game.players);
    const useDense = players.length > 11;
    const filteredPlayers = players.filter(p => answer.includes(p.playerKey) || p.name.toLowerCase().includes(searchInput.toLowerCase()));
    return (
      <div className="phase-container">
        <div className={classes.container}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.headcontainer}
          >
            <Grid item>
              <Typography className={classes.header} variant="subtitle1">Markera ditt svar</Typography>
            </Grid>
            <Grid item>
              {showSearch ? (
                <TextField
                  value={searchInput}
                  placeholder="Sök"
                  onChange={this.handleChange('searchInput')}
                />
              ) : (
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.toggleSearch}
                >
                  <SearchIcon className={classes.icon} />
                </IconButton>
              )
        }
            </Grid>
          </Grid>
          <List dense={useDense} className={classes.root}>
            <Grid container>
              {filteredPlayers.map(player => (
                <Grid key={player.key} item md={4} xs={useDense ? 6 : 12}>
                  <ListItem button onClick={() => this.toggleOption(player.key)} className={classes.listitem}>
                    <ListItemAvatar>
                      {player.avatar ? (
                        <Avatar
                          alt={player.name}
                          src={player.avatar}
                        />
                      ) : <Avatar><PersonIcon /></Avatar>}
                    </ListItemAvatar>
                    {answer.includes(player.key) ? (
                      <ListItemText className={useDense ? classes.itemtextDense : classes.itemtext} primary={player.name} />
                    ) : (
                      <ListItemText className={useDense ? classes.itemtextDense : classes.itemtext} secondary={player.name} />
                    )}
                    <ListItemSecondaryAction>
                      <Checkbox
                        onClick={() => this.toggleOption(player.key)}
                        color="primary"
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
