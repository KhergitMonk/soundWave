import React, { Component } from "react";
import { connect } from 'react-redux';
import MyMusicArtists from './artists';
import MyMusicAlbums from './albums';
import MyMusicTracks from './tracks';
import MyMusicPlaylists from './playlists';
import Loader from '../errors_and_loaders/loader';
import flatLine from '../../../assets/flat_line.png';

class MyMusicScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedTab: 'Artists' }
  }

  componentDidMount() {
    this.artistsComponent = '';
    this.albumsComponent = '';
    this.tracksComponent = '';
    this.playlistsComponent = '';
    this.selectMyMusicTab('Artists'); 
  }

  selectMyMusicTab(selectTab) {
    this.setState({ selectedTab: selectTab  });

    if ((selectTab === 'Artists') && (this.artistsComponent === '')) {
      this.artistsComponent = <MyMusicArtists/>
    }

    if ((selectTab === 'Albums') && (this.albumsComponent === '')) {
      this.albumsComponent = <MyMusicAlbums/>
    }

    if ((selectTab === 'Tracks') && (this.tracksComponent === '')) {
      this.tracksComponent = <MyMusicTracks/>
    }

    if ((selectTab === 'Playlists') && (this.playlistsComponent === '')) {
      this.playlistsComponent = <MyMusicPlaylists/>
    }
  }
  
  render() {

    //If login is pending show loading component
    if (this.props.user.loggedIn === 'pending') {
      return (
        <Loader/>
      )
    }

    //If user is not logged in simply return a message
    if (this.props.user.loggedIn === false) {
      return (
        <div className="app-error">
          <img src={flatLine}/>
          <div className="text-small">You need to be logged in to see this page</div>
        </div>
      )
    }

    //User is logged in - show him his music
    return (
      <div className="card">
        <div className="m-3">
          <h5>My music</h5>
        </div>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" onClick={ () => { this.selectMyMusicTab('Artists') } }>
            <a className={ this.state.selectedTab === 'Artists' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Artists">Artists</a>
          </li>
          <li className="nav-item" onClick={ () => { this.selectMyMusicTab('Albums') } }>
            <a className={ this.state.selectedTab === 'Albums' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Albums">Albums</a>
          </li>
          <li className="nav-item" onClick={ () => { this.selectMyMusicTab('Tracks') }}>
            <a className={ this.state.selectedTab === 'Tracks' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Tracks">Tracks</a>
          </li>
          <li className="nav-item" onClick={ () => { this.selectMyMusicTab('Playlists') } }>
            <a className={ this.state.selectedTab === 'Playlists' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Playlists">Playlists</a>
          </li>
        </ul>
        <div className={ this.state.selectedTab === 'Artists' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.artistsComponent }
        </div>
        <div className={ this.state.selectedTab === 'Albums' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.albumsComponent }
        </div>
        <div className={ this.state.selectedTab === 'Tracks' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.tracksComponent }
        </div>
        <div className={ this.state.selectedTab === 'Playlists' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.playlistsComponent }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(MyMusicScreen);