import axios from 'axios';
import settings from '../settings/index';

export const SET_USER_DATA = "SET_USER_DATA";
export const SET_MESSAGE = "SET_MESSAGE";

export const ADD_ARTIST = "ADD_ARTIST";
export const REMOVE_ARTIST = "REMOVE_ARTIST";
export const ADD_ALBUM = "ADD_ALBUM";
export const REMOVE_ALBUM = "REMOVE_ALBUM";
export const ADD_TRACK = "ADD_TRACK";
export const REMOVE_TRACK = "REMOVE_TRACK";

export const ADD_PLAYLIST = "ADD_PLAYLIST";
export const REMOVE_PLAYLIST = "REMOVE_PLAYLIST";
export const MODIFY_PLAYLIST = "MODIFY_PLAYLIST";

export const ADD_TRACK_TO_PLAYLIST = "ADD_TRACK_TO_PLAYLIST";
export const REMOVE_TRACK_FROM_PLAYLIST = "REMOVE_TRACK_FROM_PLAYLIST";

/** Set user data when logging in / refreshing page with token active */
export function setUserData(userData) {
  return {
    type: SET_USER_DATA,
    payload: userData
  };
}

/** Set error */
export function setMessage(type, message) {
  return {
    type: SET_MESSAGE,
    payload: {
      type: type,
      message: message
    }
  };
}

/** ADD ARTIST */
function addArtist(name, imgUrl) {
  return {
    type: ADD_ARTIST,
    payload: {
      name: name,
      imgUrl: imgUrl
    }
  };
}

export function addArtistAsync(name) {
  return (dispatch, getState) => {
    
    axios.get(`${settings.LastFMApiRootAddr}artist.getinfo&artist=${name}&api_key=${settings.LastFMAPIKey}&format=json`).then(response => {

      let imgUrl = '';
      if (response.data.artist.image[3]['#text']) {
        imgUrl = response.data.artist.image[3]['#text'];
      }

      const token = sessionStorage.getItem('jwtToken');

      const axiosOpts = {
        method: 'POST',
        headers: {"Authorization" : `Bearer ${token}`},
        data: {
          name: name,
          imgUrl: imgUrl
        },
        url: settings.NodeServerRootAddr + '/mymusic/artist'
      }

      axios(axiosOpts).then(response => {
        if (response.data.error) {
          dispatch(setMessage('Error', response.data.error));
        } else {
          dispatch(addArtist(name, imgUrl));
        }
      });
    })
  }
}

/** REMOVE ARTIST */
function removeArtist(name) {
  return {
    type: REMOVE_ARTIST,
    payload: name
  };
}

export function removeArtistAsync(name) {
  return (dispatch, getState) => {
    const token = sessionStorage.getItem('jwtToken');

    const axiosOpts = {
      method: 'DELETE',
      headers: {"Authorization" : `Bearer ${token}`},
      data: {},
      url: settings.NodeServerRootAddr + '/mymusic/artist/' + encodeURIComponent(name)
    }

    axios(axiosOpts).then(response => {
      if (response.data.error) {
        dispatch(setMessage('Error', response.data.error));
      } else {
        dispatch(removeArtist(name));
      }
    });
  }
}

/** ADD ALBUM */
function addAlbum(artist, name, imgUrl) {
  return {
    type: ADD_ALBUM,
    payload: {
      artist: artist,
      name: name,
      imgUrl: imgUrl
    }
  };
}

export function addAlbumAsync(artist, name) {
  return (dispatch, getState) => {
    
    axios.get(`${settings.LastFMApiRootAddr}album.getinfo&artist=${artist}&album=${name}&api_key=${settings.LastFMAPIKey}&format=json`).then(response => {

      let imgUrl = '';
      if (response.data.album.image[3]['#text']) {
        imgUrl = response.data.album.image[3]['#text'];
      }

      const token = sessionStorage.getItem('jwtToken');

      const axiosOpts = {
        method: 'POST',
        headers: {"Authorization" : `Bearer ${token}`},
        data: {
          artist: artist,
          name: name,
          imgUrl: imgUrl
        },
        url: settings.NodeServerRootAddr + '/mymusic/album'
      }

      axios(axiosOpts).then(response => {
        if (response.data.error) {
          dispatch(setMessage('Error', response.data.error));
        } else {
          dispatch(addAlbum(artist, name, imgUrl));
        }
      });

    })
  }
}

/** REMOVE ALBUM */
function removeAlbum(artist, name) {
  return {
    type: REMOVE_ALBUM,
    payload: {
      artist: artist,
      name: name
    }
  };
}

export function removeAlbumAsync(artist, name) {
  return (dispatch, getState) => {
    const token = sessionStorage.getItem('jwtToken');

    const axiosOpts = {
      method: 'DELETE',
      headers: {"Authorization" : `Bearer ${token}`},
      data: {},
      url: settings.NodeServerRootAddr + '/mymusic/album/' + encodeURIComponent(artist) + '/' + encodeURIComponent(name)
    }

    axios(axiosOpts).then(response => {
      if (response.data.error) {
        dispatch(setMessage('Error', response.data.error));
      } else {
        dispatch(removeAlbum(artist, name));
      }
    });
  }
}

/** ADD TRACK */
function addTrack(artist, name, imgUrl, lengthMilis) {
  
  return {
    type: ADD_TRACK,
    payload: {
      artist: artist,
      name: name,
      imgUrl: imgUrl,
      lengthMilis: lengthMilis
    }
  };
}

export function addTrackAsync(artist, name) {
  return (dispatch, getState) => {
    
    axios.get(`${settings.LastFMApiRootAddr}track.getinfo&artist=${artist}&track=${name}&api_key=${settings.LastFMAPIKey}&format=json`).then(response => {

      let imgUrl = '';
      if (response.data.track.album.image[1]['#text']) {
        imgUrl = response.data.track.album.image[1]['#text'];
      }

      const lengthMilis = response.data.track.duration;

      const token = sessionStorage.getItem('jwtToken');

      const axiosOpts = {
        method: 'POST',
        headers: {"Authorization" : `Bearer ${token}`},
        data: {
          artist: artist,
          name: name,
          imgUrl: imgUrl,
          lengthMilis: lengthMilis
        },
        url: settings.NodeServerRootAddr + '/mymusic/track'
      }

      axios(axiosOpts).then(response => {
        if (response.data.error) {
          dispatch(setMessage('Error', response.data.error));
        } else {
          dispatch(addTrack(artist, name, imgUrl, lengthMilis));
        }
      });

    })
  }
}

/** REMOVE TRACK */
function removeTrack(artist, name) {
  return {
    type: REMOVE_TRACK,
    payload: {
      artist: artist,
      name: name
    }
  };
}

export function removeTrackAsync(artist, name) {
  return (dispatch, getState) => {
    const token = sessionStorage.getItem('jwtToken');

    const axiosOpts = {
      method: 'DELETE',
      headers: {"Authorization" : `Bearer ${token}`},
      data: {},
      url: settings.NodeServerRootAddr + '/mymusic/track/' + encodeURIComponent(artist) + '/' + encodeURIComponent(name)
    }

    axios(axiosOpts).then(response => {
      if (response.data.error) {
        dispatch(setMessage('Error', response.data.error));
      } else {
        dispatch(removeTrack(artist, name));
      }
    });
  }
}

/** ADD PLAYLIST */
function addPlaylist(playlistId, name) {
  return {
    type: ADD_PLAYLIST,
    payload: {
      playlistId: playlistId,
      name: name
    }
  };
}

export function addPlaylistAsync(name) {
  return (dispatch, getState) => {
    
    const token = sessionStorage.getItem('jwtToken');

    const axiosOpts = {
      method: 'POST',
      headers: {"Authorization" : `Bearer ${token}`},
      data: {
        name: name
      },
      url: settings.NodeServerRootAddr + '/mymusic/playlist'
    }

    axios(axiosOpts).then(response => {
      if (response.data.error) {
        dispatch(setMessage('Error', response.data.error));
      } else {
        dispatch(addPlaylist(response.data.playlistId, name));
      }
    });

   
  }
}

/** REMOVE PLAYLIST */
function removePlaylist(playlistId) {
  return {
    type: REMOVE_PLAYLIST,
    payload: playlistId
  };
}

export function removePlaylistAsync(playlistId) {
  return (dispatch, getState) => {
    
    const token = sessionStorage.getItem('jwtToken');

    const axiosOpts = {
      method: 'DELETE',
      headers: {"Authorization" : `Bearer ${token}`},
      data: {
        name: name
      },
      url: settings.NodeServerRootAddr + '/mymusic/playlist/' + playlistId
    }

    axios(axiosOpts).then(response => {
      if (response.data.error) {
        dispatch(setMessage('Error', response.data.error));
      } else {
        dispatch(removePlaylist(playlistId))
      }
    });

   
  }
}

/** MODIFY PLAYLIST */
function modifyPlaylist(playlistId, playlistData) {
  return {
    type: MODIFY_PLAYLIST,
    payload: {
      playlistId: playlistId,
      playlistData: playlistData
    }
  };
}

export function modifyPlaylistAsync(playlistId, playlistData) {
  return (dispatch, getState) => {
    
    const token = sessionStorage.getItem('jwtToken');

    const axiosOpts = {
      method: 'PUT',
      headers: {"Authorization" : `Bearer ${token}`},
      data: {
        playlistData: playlistData
      },
      url: settings.NodeServerRootAddr + '/mymusic/playlist/' + playlistId
    }

    axios(axiosOpts).then(response => {
      if (response.error) {
        dispatch(setMessage('Error', response.data.error));
      } else {
        dispatch(modifyPlaylist(playlistId, playlistData));
        dispatch(setMessage('Message', 'Playlist saved successfully'));
      }
    });
  }
}

/** ADD TRACK TO PLAYLIST */
function addTrackToPlaylist(playlistId, artist, name, imgUrl, lengthMilis) {
  return {
    type: ADD_TRACK_TO_PLAYLIST,
    payload: {
      playlistId: playlistId,
      artist: artist,
      name: name,
      imgUrl: imgUrl,
      lengthMilis: lengthMilis
    }
  };
}

export function addTrackToPlaylistAsync(playlistId, artist, name) {
  return (dispatch, getState) => {
    
    axios.get(`${settings.LastFMApiRootAddr}track.getinfo&artist=${artist}&track=${name}&api_key=${settings.LastFMAPIKey}&format=json`).then(response => {

      let imgUrl = '';
      if (response.data.track.album.image[3]['#text']) {
        imgUrl = response.data.track.album.image[3]['#text'];
      }

      const lengthMilis = response.data.track.duration;

      const token = sessionStorage.getItem('jwtToken');

      const axiosOpts = {
        method: 'POST',
        headers: {"Authorization" : `Bearer ${token}`},
        data: {
          playlistId: playlistId,
          artist: artist,
          name: name,
          imgUrl: imgUrl,
          lengthMilis: lengthMilis
        },
        url: settings.NodeServerRootAddr + '/mymusic/playlist/track'
      }

      axios(axiosOpts).then(response => {
        if (response.error) {
          dispatch(setMessage('Error', response.data.error));
        } else {
          dispatch(addTrackToPlaylist(playlistId, artist, name, imgUrl, lengthMilis));
        }
      });

    })
  }
}

/** REMOVE TRACK FROM PLAYLIST */
function removeTrackFromPlaylist(playlistId, artist, name) {
  return {
    type: REMOVE_TRACK_FROM_PLAYLIST,
    payload: {
      playlistId: playlistId,
      artist: artist,
      name: name
    }
  };
}

export function removeTrackFromPlaylistAsync(playlistId, artist, name) {
  return (dispatch, getState) => {
    const token = sessionStorage.getItem('jwtToken');

    const axiosOpts = {
      method: 'DELETE',
      headers: {"Authorization" : `Bearer ${token}`},
      data: {},
      url: settings.NodeServerRootAddr + '/mymusic/playlist/track/' + playlistId + '/' + encodeURIComponent(artist) + '/' + encodeURIComponent(name)
    }

    axios(axiosOpts).then(response => {
      if (response.error) {
        dispatch(setMessage('Error', response.data.error));
      } else {
        dispatch(removeTrackFromPlaylist(playlistId, artist, name));
      }
    });
  }
}
