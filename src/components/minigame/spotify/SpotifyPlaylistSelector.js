import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import * as util from './SpotifyUtil';
import {
  MISSING_ALBUM_COVER,
  MIN_SONGS_PLAYLIST,
} from './SpotifyConstants';

function slimifyPlaylist(playlist) {
  const slim = {
    name: playlist.name,
    id: playlist.id,
    img: playlist.images.length > 0 ? playlist.images[0] : MISSING_ALBUM_COVER,
    totalSongs: playlist.tracks.total,
  };
  return slim;
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
      + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
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
      <GridList cellHeight={200} spacing={1} className={classes.gridList}>
        {slimPlaylists.map(playlist => (
          <GridListTile key={playlist.id} cols={1} rows={1}>
            <img src={playlist.img.url} alt={playlist.name} />
            <GridListTileBar
              title={`${playlist.name} - ${playlist.totalSongs}`}
              titlePosition="top"
              actionIcon={(
                <IconButton className={classes.icon} onClick={() => setSelection(playlist.id)}>
                  <StarBorderIcon />
                </IconButton>
)}
              actionPosition="left"
              className={classes.titleBar}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
SpotifyPlayListSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  playlists: PropTypes.array.isRequired,
  setSelection: PropTypes.func,
};

export default withStyles(styles)(SpotifyPlayListSelector);
