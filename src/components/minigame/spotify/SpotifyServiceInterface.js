
function getSpotifyHeader(token, method) {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  const header = {
    method,
    headers,
  };
  return header;
}
export async function getPlaylistTracks(playlistId, token) {
  const header = getSpotifyHeader(token, 'GET');

  let hasNext = true;
  let offset = 0;
  const playlistTracks = [];
  while (hasNext) {
    // from_token ska kunna hämta flera previewUrls. kanske lösa problem med låtar som får 404?
    // &market=from_token
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&market=from_token`, header);
    const playlistResult = await playlistResponse.json();
    playlistTracks.push(...playlistResult.items);
    if (playlistResult.items.length < 100) {
      hasNext = false;
    } else {
      offset += 100;
    }
  }
  return playlistTracks;
}

export async function getArtists(artistIds, token) {
  const header = getSpotifyHeader(token, 'GET');


  const chunks = [];
  const size = 50;

  while (artistIds.length > 0) {
    chunks.push(artistIds.splice(0, size));
  }

  const artists = [];
  for (const ids of chunks) {
    const inputids = ids.join(',');
    const artistsResponse = await fetch(`https://api.spotify.com/v1/artists?ids=${inputids}`, header);
    const result = await artistsResponse.json();
    artists.push(...result.artists);
  }
  return artists;
}

export async function getArtistTopTracks(artistId, token) {
  const header = getSpotifyHeader(token, 'GET');

  const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=from_token`, header);
  const topTracksResult = await topTracksResponse.json();
  return topTracksResult.tracks;
}

export async function getTrackFeatures(trackIds, token) {
  const header = getSpotifyHeader(token, 'GET');

  const chunks = [];
  const size = 100;

  while (trackIds.length > 0) { chunks.push(trackIds.splice(0, size)); }

  const trackFeatures = [];
  for (const ids of chunks) {
    const inputids = ids.join(',');
    const artistsResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${inputids}`, header);
    const result = await artistsResponse.json();
    trackFeatures.push(...result.audio_features);
  }
  return trackFeatures;
}

export async function getGenreTopTracks(genre, token) {
  const header = getSpotifyHeader(token, 'GET');
  const uriGenre = encodeURI(genre);
  const topTracksResponse = await fetch(`https://api.spotify.com/v1/search?q=genre%3A%22${uriGenre}%22&type=track&market=from_token&limit=50`, header);
  const topTracksResult = await topTracksResponse.json();
  return topTracksResult.tracks;
}

export default[];
