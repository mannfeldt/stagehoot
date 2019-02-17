import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
  dot: {
    fontSize: '11px',
    padding: '0 8px',
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
  const slimPlaylists = playlists.map(pl => slimifyPlaylist(pl));

  return (
    <div>
      <Typography className={classes.header} variant="subtitle1">Select a playlist</Typography>
      <List className={classes.root}>
        <Grid container>
          {slimPlaylists.map(playlist => (
            <Grid item md={4} xs={12} key={playlist.id}>
              <ListItem button onClick={() => setSelection(playlist.id)} className={classes.listitem}>
                <img src={playlist.img.url} alt={playlist.name} className={classes.img} onError={(e) => { e.target.onerror = null; e.target.src = MISSING_ALBUM_COVER; }} />
                <ListItemText
                  classes={{ primary: classes.primary }}
                  primary={playlist.name}
                  secondary={(
                    <span>
                      {`by ${playlist.owner}`}
                      <span className={classes.dot}>•</span>
                      {`${playlist.totalSongs} songs`}
                    </span>
                  )}
                />
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
