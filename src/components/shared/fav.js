import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  addTrackToPlaylistAsync, 
  removeTrackFromPlaylistAsync, 
  addArtistAsync, 
  removeArtistAsync, 
  addAlbumAsync, 
  removeAlbumAsync, 
  addTrackAsync, 
  removeTrackAsync 
} from '../../actions/user';
import favActive from '../../../assets/check.png';
import favInactive from '../../../assets/plus.png';


class Fav extends Component {
  constructor(props) {
    super(props);

    this.state = { trackOptionsPopupOpen: false }
  }

  returnTrackOptionsPopup() {
    if (this.state.trackOptionsPopupOpen === false) return null;

    let { artistName, songName } = this.props;
    let icon, action;

    if (this.props.user.myMusic.tracks.find(track => (track.name === songName && track.artist === artistName))) {
      icon = favActive;
      action = () => { this.props.removeTrackAsync(artistName, songName) }
    } else {
      icon = favInactive;
      action = () => { this.props.addTrackAsync(artistName, songName) }
    }

    const playlistNames = this.props.user.myMusic.playlists.map((playlist) => {
      
      let icon, action;
      if (playlist.tracks.find(track => (track.name === songName && track.artist === artistName))) {
        icon = favActive;
        action = () => { this.props.removeTrackFromPlaylistAsync(playlist._id, artistName, songName) }
      } else {
        icon = favInactive;
        action = () => { this.props.addTrackToPlaylistAsync(playlist._id, artistName, songName) }
      }
      
      return (
        <div key={playlist._id} className="clearfix">
          <span>{playlist.name}</span>
          <div className="float-right fav fav-inner" onClick={action}>
            <img src={icon} />
          </div>
        </div>
      )
    })

    

    return (
      <div className="track-options-popup p-2" onMouseLeave={() => { this.setState({ trackOptionsPopupOpen: false }) }}>
        <div className="clearfix">
          <span>Add/remove from my tracks:</span>
          <div className="float-right fav fav-inner" onClick={action}>
            <img src={icon} />
          </div>
        </div>
        { playlistNames.length ? 
          <div>
            <hr/>
            <div>Add/remove from playlist:</div>
            <div>{playlistNames}</div> 
          </div>
          : null}
      </div>
    )
  }

  render() {

    if (this.props.user.loggedIn !== true) {
      return null;
    }

    let { favType, artistName, songName, albumName } = this.props;

    let icon, action, title;

    if (favType === 'Artist') {
      if (this.props.user.myMusic.artists.find(artist => (artistName === artist.name))) {
        icon = favActive;
        action = () => { this.props.removeArtistAsync(artistName) }
        title = 'Click to remove artist from favourites';
        
      } else {
        icon = favInactive;
        action = () => { this.props.addArtistAsync(artistName) }
        title = 'Click to add artist to favourites';
      }
    }

    if (favType === 'Album') {
      if (this.props.user.myMusic.albums.find(album => (album.name === albumName && album.artist === artistName))) {
        icon = favActive;
        action = () => { this.props.removeAlbumAsync(artistName, albumName) }
        title = 'Click to remove album from favourites';
      } else {
        icon = favInactive;
        action = () => { this.props.addAlbumAsync(artistName, albumName) }
        title = 'Click to add album to favourites';
      }
    }

    if (favType === 'Song') {
      title = 'Click to add/remove track from favourites or playlist';

      if (this.props.user.myMusic.tracks.find(track => (track.name === songName && track.artist === artistName))) {
        icon = favActive;
        
      } else {
        icon = favInactive;
      }

      action = (event) => { 
        if (event.target.parentNode.className.indexOf('fav-inner') !== -1) return;

        this.setState({ trackOptionsPopupOpen: !this.state.trackOptionsPopupOpen }) 
      }
    }

    return (
      <div className="float-right fav" onClick={action} title={title}>
        <img src={icon} />
        {this.returnTrackOptionsPopup()}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { addTrackToPlaylistAsync, removeTrackFromPlaylistAsync, addArtistAsync, removeArtistAsync, addAlbumAsync, removeAlbumAsync, addTrackAsync, removeTrackAsync } )(Fav); 