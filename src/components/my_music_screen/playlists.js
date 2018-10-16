import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Pagination from "react-js-pagination"; 
import PlaylistEditor from './playlist_edit';
import ImgWithPreloader from '../errors_and_loaders/img_with_preloader';
import { addPlaylistAsync, removePlaylistAsync } from '../../actions/user';
import trashIcon from '../../../assets/trash.png';
import playIcon from '../../../assets/play_white.png';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css' 



class MyMusicPlaylists extends Component {
  constructor(props) {
    super(props);


    this.resultsPerPage = 8; 
    this.state = { page: 1, editingPlaylistId: null, newPlaylistName: '' }
  }

  updateNewPlaylistName() {
    //get search string
    const newPlaylistName = document.getElementById('newPlaylistName').value;

    //dispatch state change
    this.setState({ newPlaylistName: newPlaylistName });
  }

  onNewPlaylistKeypress(event) {
    if (event.charCode === 13) this.onNewPlaylist();
  }

  onNewPlaylist() {
    if (this.state.newPlaylistName.trim() === '')
    {
        ReactTooltip.show(document.getElementById('newPlaylistName'));
        return false;
    }     

    this.props.addPlaylistAsync(this.state.newPlaylistName);
    this.setState({ newPlaylistName: '' });
  }

  editPlaylist(playlistId) {
    this.setState({ editingPlaylistId: playlistId })
  }

  confirmPlaylistDelete(event, playlistId) {
    event.stopPropagation();

    confirmAlert({
      title: 'Delete this playlist?',
      message: 'Are you sure you want to delete this playlist?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.props.removePlaylistAsync(playlistId)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })

  }

  getPlaylistsCards() {
    if (this.state.editingPlaylistId) return null;

    if (this.props.playlists.length === 0) {
      return (
        <div className="text-center m-5">
          <h3>You have no playlists created yet</h3>
          <br/>
          <h5>You can add create your playlists by entering a name in the box above and clicking 'Add playlist' </h5>
        </div>
      )
    }

    const playlistsToSkip = (this.state.page - 1) * this.resultsPerPage;
    const playlistsToDisplay = this.props.playlists.slice(playlistsToSkip, playlistsToSkip + this.resultsPerPage );

    const playlistCards = playlistsToDisplay.map((playlist, index) => { 
      
      const elementKey = ((this.state.page - 1) * this.resultsPerPage) + index;

      let playlistImg = '';
      if (playlist.tracks[0]) playlistImg = playlist.tracks[0].imgUrl;

      return (
      <div key={elementKey} className="col-12 col-sm-6 col-md-3 mb-2" 
      style={{ cursor: 'pointer'}} onClick={() => this.editPlaylist(playlist._id)}>
        <div className="card h-100">
          <div className="playlist-options-overlay">
            <Link to={'/playlist_play/'+playlist._id}><img className="playlist-delete-icon" src={playIcon}/></Link>
            <img className="playlist-delete-icon" src={trashIcon} onClick={(event) => {this.confirmPlaylistDelete(event, playlist._id)}}/>
          </div>
          <ImgWithPreloader 
              classes="card-img-top" 
              src={playlistImg} 
              alt={playlist.name}/>
          <div className="card-body">   
            <div>{playlist.name}</div>
          </div>
        </div>
      </div>
      )

    })

    return (
      <div className="row">
        {playlistCards}
      </div>
    );
  }

  getPlaylistsCardsPagination() {
    if (this.props.playlists.length < 2) return null;
    if (this.state.editingPlaylistId) return null;

    return (
      <Pagination
        activePage={this.state.page}
        itemsCountPerPage={this.resultsPerPage}
        totalItemsCount={this.props.playlists.length}
        pageRangeDisplayed={5}
        onChange={(pageNo) => {this.setState({ page: pageNo })}}
        itemClass='page-item'
        linkClass='page-link'
      />
    )
  }

  getAddPlaylistInputs() {
    if (this.state.editingPlaylistId) return null;

    return (
      <div className="row">
        <div className="col-12">
          <div className="input-group mb-4 mt-2">
            <input data-tip data-for='newPlaylistName' onKeyPress={ this.onNewPlaylistKeypress.bind(this) }
            type="text" id="newPlaylistName" className="form-control" placeholder="Playlist name" aria-label="Playlist name" 
            value={this.state.newPlaylistName} onChange={this.updateNewPlaylistName.bind(this)}/>
            <ReactTooltip id='newPlaylistName' type='error' place='bottom' event='nothing' eventOff="click">
                <span>Please enter playlist name</span>
            </ReactTooltip>
            <div className="input-group-append">
                <button className="btn btn-success" type="button" onClick={() => this.onNewPlaylist()}>Add playlist</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  removePlaylist() {
    this.props.removePlaylistAsync(this.state.editingPlaylistId);
  }

  getPlaylistEditor() {
    if (!this.state.editingPlaylistId) return null;

    const playlistData = this.props.playlists.find(playlist => {
      if (playlist._id === this.state.editingPlaylistId) {
        return true;
      } else {
        return false;
      }
    });

    return <PlaylistEditor playlistData={playlistData} onBackToPlaylists={ () => {this.setState({ editingPlaylistId: null })} }/>
  }

  render() {
    return (
      <div>
        {this.getAddPlaylistInputs()}
        {this.getPlaylistsCards()}
        {this.getPlaylistsCardsPagination()}
        {this.getPlaylistEditor()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    playlists: state.user.myMusic.playlists
  }
}

export default connect(mapStateToProps, { addPlaylistAsync, removePlaylistAsync })(MyMusicPlaylists);