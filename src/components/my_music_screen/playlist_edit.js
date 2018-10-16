import React, { Component } from "react";
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import tempImg from '../../../assets/loader.png';
import trashIcon from '../../../assets/trash.png';
import infoIcon from '../../../assets/info.png';
import saveIcon from '../../../assets/save.png';
import backIcon from '../../../assets/back.png';
import { millisToMinutesAndSeconds } from '../../modules/shared_funcs';
import { modifyPlaylistAsync } from '../../actions/user';
import { connect } from 'react-redux';

class PlaylistEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { playlistData: this.props.playlistData }
  }

  changePlaylistName(event) {
    const newPlaylistName = event.target.value;
    const playlistData = JSON.parse(JSON.stringify(this.state.playlistData));
    playlistData.name = newPlaylistName;
    
    this.setState({
      playlistData: playlistData,
    });
  }

  onSortEnd({oldIndex, newIndex}) {
    const playlistData = JSON.parse(JSON.stringify(this.state.playlistData));

    playlistData.tracks = arrayMove(playlistData.tracks, oldIndex, newIndex)

    this.setState({
      playlistData: playlistData,
    });
  }
  
  deletePlaylistItem(trackId) {
    const playlistData = JSON.parse(JSON.stringify(this.state.playlistData));
    const trackToDeleteIndex = playlistData.tracks.findIndex(track => {
      if (track._id === trackId) {
        return true;
      }
    })

    playlistData.tracks.splice(trackToDeleteIndex, 1);

    this.setState({ playlistData: playlistData });
  }

  getPlaylistSortable() {

    if (this.state.playlistData.tracks.length === 0) {
      return (
        <div className="playlist-no-items p-5">
          <h3>No tracks in this playlist yet</h3>
          <br/>
          <h5>You can add tracks to playlist from various places in the app - for example you can try the search function </h5>
        </div>
      ) 
    }

    const SortableItem = SortableElement(({track}) => {
      let imgUrl = {tempImg};
      if (track.imgUrl) imgUrl = track.imgUrl;

      return (
        <li className="list-group-item clear-fix track-list-item">
          <div className="media">
            <img src={imgUrl} className="mr-3 track-list-item-img" alt={track.name}/>
            <div className="media-body">
              <strong>{track.artist}</strong> - {track.name}
              <img className="track-list-item-delete-icon float-right" src={trashIcon} onClick={() => { this.deletePlaylistItem(track._id) }}/>
              <div className="float-right">{millisToMinutesAndSeconds(track.lengthMilis)}</div>
            </div>
          </div>
        </li>
      )
    });

    const SortableList = SortableContainer(({tracks}) => {
      return (
        <ul className="list-group">
          {tracks.map((track, index) => (
            <SortableItem key={`item-${index}`} index={index} track={track}/>
          ))}
        </ul>
      );
    });

    return (
      <SortableList tracks={this.state.playlistData.tracks} onSortEnd={this.onSortEnd.bind(this)} distance={10} useWindowAsScrollContainer={true}/>
    )
  }

  render() {
    return (
      <div>
        <div>
          <div className="playlist-edit-tip mb-2">
            <img src={infoIcon}/> You can change playlist name below. Use drag &amp; drop to change position of tracks on your playlist.
          </div>
        </div>
        <div className="clearfix">
          <h4 className="float-left">Editing playlist: </h4>
          <div className="float-right">
            <button className="btn btn-light mr-2 playlist-save-btn" onClick={ () => { this.props.modifyPlaylistAsync(this.state.playlistData._id, this.state.playlistData) } }>
              <img src={saveIcon} />
              Save playlist
            </button>
            <button className="btn btn-light playlist-back-btn" onClick={ this.props.onBackToPlaylists }>
              <img src={backIcon} />
              Back to playlists
            </button>
          </div>
          <input className="playlist-name-input" type="text" value={this.state.playlistData.name} onChange={(event) => { this.changePlaylistName(event) }}/>
        </div>
        <hr/>
        <div>
          {this.getPlaylistSortable()}
        </div>
      </div>
    )
  }
}

export default connect(null, { modifyPlaylistAsync })(PlaylistEditor);