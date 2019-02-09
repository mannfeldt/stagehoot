import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PersonIcon from '@material-ui/icons/Person';

const styles = theme => ({
  img: {
    height: 64,
  },
  listitem: {

  },
  primary: {
    fontSize: 16,
  },
  root: {
    backgroundColor: 'inherit',
  },
  header: {
    fontSize: 28,
    padding: 15,
    fontWeight: 400,
  },
});
function CorrectAnswer(props) {
  const { classes, answer } = props;
  if (!answer || answer.length === 0) {
    return null;
  }
  const useDense = answer.length > 3;

  return (
    <div>
      <Typography className={classes.header}>Rätt svar</Typography>
      <Divider />
      <List dense={useDense} className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          {answer.map(player => (
            <Grid key={player.key} item>
              <ListItem className={classes.listitem}>
                <ListItemAvatar>
                  {player.avatar ? (
                    <Avatar
                      alt={player.name}
                      src={player.avatar}
                    />
                  ) : <Avatar><PersonIcon /></Avatar>}
                </ListItemAvatar>
                <ListItemText className={useDense ? classes.itemtextDense : classes.itemtext} primary={player.name} />
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
    </div>
  );
}
CorrectAnswer.propTypes = {
  classes: PropTypes.object.isRequired,
  answer: PropTypes.array.isRequired,
};

export default withStyles(styles)(CorrectAnswer);
