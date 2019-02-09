import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as util from './SpotifyUtil';
import {
  MISSING_ALBUM_COVER,
} from './SpotifyConstants';

function slimifyPlaylist(playlist) {
  const slim = {
    name: playlist.name,
    id: playlist.id,
    img: playlist.images.length > 0 ? playlist.images[0] : MISSING_ALBUM_COVER,
    totalSongs: playlist.tracks.total,
    owner: playlist.owner.display_name,
  };
  return slim;
}

const styles = theme => ({
  img: {
    height: 64,
    webkitBboxShadow: '0 0 10px rgba(0,0,0,.3)',
    boxShadow: '0 0 10px rgba(0,0,0,.3)',
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
    backgroundColor: '#282828',
    padding: 10,
    marginBottom: 10,
  },
});
function SpotifyPlayListSelector(props) {
  const { classes, playlists, setSelection } = props;
  if (!playlists) {
    return null;
  }
  const slimPlaylists = playlists.filter(p => util.isValidPlaylist(p)).map(pl => slimifyPlaylist(pl));

  return (
    <div>
      <Typography className={classes.header} variant="subtitle1">Select a playlist</Typography>
      <List className={classes.root}>
        <Grid container>
          {slimPlaylists.map(playlist => (
            <Grid item md={4} xs={12}>
              <ListItem key={playlist.id} button onClick={() => setSelection(playlist.id)} className={classes.listitem}>
                <img src={playlist.img.url} alt={playlist.name} className={classes.img} />
                <ListItemText classes={{ primary: classes.primary }} primary={playlist.name} secondary={`by ${playlist.owner} ● ${playlist.totalSongs} songs`} />
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </List>

    </div>
  );
}
SpotifyPlayListSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  playlists: PropTypes.array.isRequired,
  setSelection: PropTypes.func,
};

export default withStyles(styles)(SpotifyPlayListSelector);
