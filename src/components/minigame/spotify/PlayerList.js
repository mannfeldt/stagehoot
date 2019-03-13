import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PersonIcon from '@material-ui/icons/Person';
import Fade from '@material-ui/core/Fade';

const styles = theme => ({
  primary: {
    fontSize: 16,
  },
  root: {
    backgroundColor: 'inherit',
  },
  avatar: {
    height: 120,
    width: 120,
  },
  itemtext: {
    fontSize: 30,
  },
});
function PlayerList(props) {
  const { classes, players } = props;
  if (!players || players.length === 0) {
    return null;
  }
  const useDense = players.length > 3;

  return (
    <div>
      <List dense={useDense} className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          {players.map(player => (
            <Grid key={player.key} item>
              <Fade in>
                <ListItem className={classes.listitem}>
                  <ListItemAvatar>
                    {player.avatar ? (
                      <Avatar
                        className={classes.avatar}
                        alt={player.name}
                        src={player.avatar}
                      />
                    ) : <Avatar><PersonIcon /></Avatar>}
                  </ListItemAvatar>
                  <ListItemText className={classes.itemtext} primary={player.name} />
                </ListItem>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </List>
    </div>
  );
}
PlayerList.propTypes = {
  classes: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
};

export default withStyles(styles)(PlayerList);
