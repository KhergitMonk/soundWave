import { SET_USER_DATA } from "../actions/user";
import { SET_MESSAGE } from "../actions/user";

import { ADD_ARTIST } from "../actions/user";
import { REMOVE_ARTIST } from "../actions/user";

import { ADD_ALBUM } from "../actions/user";
import { REMOVE_ALBUM } from "../actions/user";

import { ADD_TRACK } from "../actions/user";
import { REMOVE_TRACK } from "../actions/user";

import { ADD_PLAYLIST } from "../actions/user";
import { REMOVE_PLAYLIST } from "../actions/user";
import { MODIFY_PLAYLIST } from "../actions/user";

import { ADD_TRACK_TO_PLAYLIST } from "../actions/user";
import { REMOVE_TRACK_FROM_PLAYLIST } from "../actions/user";


export default function(
  state = {
    loggedIn: 'pending',
    username: "",
    message: {
      type: '',
      message: ''
    },
    myMusic: {
      artists: [],
      albums: [],
      tracks: [],
      playlists: []
    }
  },
  action
) {
  switch (action.type) {
    case SET_USER_DATA: {
      return { ...state, ...action.payload };
    }

    case SET_MESSAGE: {
      return { ...state, message: action.payload };
    }

    case ADD_ARTIST: {
      const stateCopy = JSON.parse(JSON.stringify(state));
      stateCopy.myMusic.artists.push({
        name: action.payload.name,
        imgUrl: action.payload.imgUrl
      });
      return stateCopy;
    }

    case REMOVE_ARTIST: {
      const stateCopy = JSON.parse(JSON.stringify(state));

      const artistIndex = stateCopy.myMusic.artists.findIndex(artist => {
        if (artist.name === action.payload) {
          return true;
        }
      });

      stateCopy.myMusic.artists.splice(artistIndex, 1);

      return stateCopy;
    }

    case ADD_ALBUM: {
      const stateCopy = JSON.parse(JSON.stringify(state));
      stateCopy.myMusic.albums.push({
        artist: action.payload.artist,
        name: action.payload.name,
        imgUrl: action.payload.imgUrl
      });
      return stateCopy;
    }

    case REMOVE_ALBUM: {
      const stateCopy = JSON.parse(JSON.stringify(state));

      const albumIndex = stateCopy.myMusic.albums.findIndex(album => {
        if ((album.name === action.payload.name) && (album.artist === action.payload.artist)) {
          return true;
        }
      });

      stateCopy.myMusic.albums.splice(albumIndex, 1);

      return stateCopy;
    }

    case ADD_TRACK: {
      const stateCopy = JSON.parse(JSON.stringify(state));
      stateCopy.myMusic.tracks.push({
        artist: action.payload.artist,
        name: action.payload.name,
        imgUrl: action.payload.imgUrl,
        lengthMilis: action.payload.lengthMilis,
      });
      return stateCopy;
    }

    case REMOVE_TRACK: {
      const stateCopy = JSON.parse(JSON.stringify(state));

      const trackIndex = stateCopy.myMusic.tracks.findIndex(track => {
        if ((track.name === action.payload.name) && (track.artist === action.payload.artist)) {
          return true;
        }
      });

      stateCopy.myMusic.tracks.splice(trackIndex, 1);

      return stateCopy;
    }

    case ADD_PLAYLIST: {
      const stateCopy = JSON.parse(JSON.stringify(state));

      stateCopy.myMusic.playlists.push({ name: action.payload.name, _id: action.payload.playlistId, tracks: [] });

      return stateCopy;
    }

    case REMOVE_PLAYLIST: {
      const stateCopy = JSON.parse(JSON.stringify(state));

      const playlistIndex = stateCopy.myMusic.playlists.findIndex(playlist => {
        if (playlist._id === action.payload) {
          return true;
        }
      });

      stateCopy.myMusic.playlists.splice(playlistIndex, 1);

      return stateCopy;
    }

    case MODIFY_PLAYLIST: {
      const stateCopy = JSON.parse(JSON.stringify(state));

      const playlistIndex = stateCopy.myMusic.playlists.findIndex(playlist => {
        if (playlist._id === action.payload.playlistId) {
          return true;
        }
      });

      stateCopy.myMusic.playlists[playlistIndex] = action.payload.playlistData;

      return stateCopy;
    }

    case ADD_TRACK_TO_PLAYLIST: {
      const stateCopy = JSON.parse(JSON.stringify(state));
      
      const playlistIndex = stateCopy.myMusic.playlists.findIndex(playlist => {
        if (playlist._id === action.payload.playlistId) {
          return true;
        }
      });
       
      stateCopy.myMusic.playlists[playlistIndex].tracks.push({
        artist: action.payload.artist,
        name: action.payload.name,
        imgUrl: action.payload.imgUrl,
        lengthMilis: action.payload.lengthMilis,
      });
      return stateCopy;
    }

    case REMOVE_TRACK_FROM_PLAYLIST: {
      const stateCopy = JSON.parse(JSON.stringify(state));

      const playlistIndex = stateCopy.myMusic.playlists.findIndex(playlist => {
        if (playlist._id === action.payload.playlistId) {
          return true;
        }
      });

      const trackIndex = stateCopy.myMusic.playlists[playlistIndex].tracks.findIndex(track => {
        if ((track.name === action.payload.name) && (track.artist === action.payload.artist)) {
          return true;
        }
      });

      stateCopy.myMusic.playlists[playlistIndex].tracks.splice(trackIndex, 1);

      return stateCopy;
    }

    default:
      return state;
  }
}
