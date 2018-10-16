import React, { Component } from 'react';
import ArtistInfo from './artist_info';
import LyricsInfo from './lyrics_info';
import TrackInfo from './track_info';
import SimilarTracksInfo from './similar_tracks_info.js';

export default class SongInfo extends Component {
  constructor(props){
    super(props);

    this.state = { selectedTab: '' }
  }
  
  resetComponent(){
    this.trackInfoComponent = '';
    this.artistComponent = '';
    this.lyricsComponent = '';
    this.similarTracksComponent = '';
    this.selectSongInfoTab('Track info'); 
  }

  componentDidMount() {
    this.resetComponent();
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.artist !== this.props.artist) || (prevProps.song !== this.props.song)) {
      this.resetComponent();
    }
  }

  selectSongInfoTab(selectTab) {
    this.setState({ selectedTab: selectTab  });

    if ((selectTab === 'Track info') && (this.trackInfoComponent === '')) {
      this.trackInfoComponent = <TrackInfo artist={this.props.artist} song={this.props.song}/>
    }

    if ((selectTab === 'Artist info') && (this.artistComponent === '')) {
      this.artistComponent = <ArtistInfo artist={this.props.artist}/>
    }

    if ((selectTab === 'Lyrics') && (this.lyricsComponent === '')) {
      this.lyricsComponent = <LyricsInfo artist={this.props.artist} song={this.props.song}/>
    }

    if ((selectTab === 'Similar tracks') && (this.similarTracksComponent === '')) {
      this.similarTracksComponent = <SimilarTracksInfo artist={this.props.artist} song={this.props.song}/>
    }
  }
 
  render() {
    return (
    <div className="mt-3">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" onClick={ () => { this.selectSongInfoTab('Track info') } }>
            <a className={ this.state.selectedTab === 'Track info' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Track info">Track info</a>
          </li>
          <li className="nav-item" onClick={ () => { this.selectSongInfoTab('Artist info') } }>
            <a className={ this.state.selectedTab === 'Artist info' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Artist info">Artist info</a>
          </li>
          <li className="nav-item" onClick={ () => { this.selectSongInfoTab('Lyrics') }}>
            <a className={ this.state.selectedTab === 'Lyrics' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Lyrics">Lyrics</a>
          </li>
          <li className="nav-item" onClick={ () => { this.selectSongInfoTab('Similar tracks') } }>
            <a className={ this.state.selectedTab === 'Similar tracks' ? "nav-link active" : "nav-link" } 
            data-toggle="tab" role="tab" aria-controls="Similar tracks">Similar tracks</a>
          </li>
        </ul>
        <div id="trackInfoContent"
        className={ this.state.selectedTab === 'Track info' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.trackInfoComponent }
        </div>
        <div id="artistContent"
        className={ this.state.selectedTab === 'Artist info' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.artistComponent }
        </div>
        <div id="lyricsContent"
        className={ this.state.selectedTab === 'Lyrics' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.lyricsComponent }
        </div>
        <div id="similarTracksContent"
        className={ this.state.selectedTab === 'Similar tracks' ? "tab-content p-3" : "tab-content p-3  d-none" } >
          { this.similarTracksComponent }
        </div>
    </div>
    )
  }
}

