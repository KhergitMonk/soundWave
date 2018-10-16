import React, { Component } from "react";
import { connect } from 'react-redux';
import YTSearch from "youtube-api-search";
import YouTube from "react-youtube"; //https://www.npmjs.com/package/react-youtube
import settings from "../settings/index";
import playImg from "../../assets/play.png";
import * as sf from '../modules/shared_funcs';
import ImgWithPreloader from './errors_and_loaders/img_with_preloader';
import ErrorLoadingData from './errors_and_loaders/error_loading_data';
import SongInfo from "./song_info/song_info.js";
import { Scrollbars } from 'react-custom-scrollbars';

class PlaylistPlay extends Component {
  constructor(props) {
    super(props);

    this.state = { youTubeVideoId: '', currentTrack: 0 }

    this.playerOptions = {
      height: "390",
      width: "640",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
  }

  componentDidMount() {
    this.youTubeGetVideoID();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.currentTrack !== this.state.currentTrack) || 
    (JSON.stringify(this.props.playlist) !== JSON.stringify(prevProps.playlist))) {
      this.youTubeGetVideoID();
    }
  }

  youTubeGetVideoID() {
    if (!this.props.playlist) {
      return false;
    }

    const trackIndex = this.state.currentTrack;
    const searchTerm = this.props.playlist.tracks[trackIndex].artist + " " + this.props.playlist.tracks[trackIndex].name;

    YTSearch({ key: settings.YTSearchKey, term: searchTerm }, videos => {
      this.setState({ youTubeVideoId: videos[0].id.videoId });
    });
  }

  onVideoEnd(event) {
    const nextTrackIndex = this.state.currentTrack + 1;
    if (nextTrackIndex < this.props.playlist.tracks.length) {//we can open next track
      this.setTrack(nextTrackIndex)
    }
  }

  setTrack(trackIndex) {
    this.setState({ currentTrack: trackIndex });
  }

  getTrackList() {
    let trackList = this.props.playlist.tracks.map((track, index) => {
      
      let elementClasses = 'list-group-item p-2';
      if (index === this.state.currentTrack) {
        elementClasses += ' active';
      }
      
      return (
      <li key={index} className={elementClasses} onClick={() => { this.setTrack(index) }}>
        <div className="clearfix">
          <div className="float-left"><img src={playImg} className="playImg"/> 
            {index+1}. <strong>{track.artist}</strong> - {track.name}
          </div>
          <div className="float-right">{sf.millisToMinutesAndSeconds(track.lengthMilis)}</div>
        </div>
      </li>
      )
    })

    return trackList;
  }

  render() {
    if ((!this.props.playlist) || (this.props.playlist.tracks.length === 0)) {
      return <ErrorLoadingData error='Playlist not found or no tracks in playlist'/>
    }

    return (
      <div className="card">
        <div className="card-body"> 
          <div className="row">
            <div className="col-12">
              <div className="media">
                <ImgWithPreloader
                  src={this.props.playlist.tracks[0].imgUrl} 
                  classes={'m-3'}
                  maxWidth={120}
                  maxHeight={120}
                  alt={this.props.playlist.name}/>
                <div className="media-body">
                  <div>
                    <h5>Playling playlist</h5>
                    <h4><strong>{this.props.playlist.name}</strong></h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-md-6">
              <div className="video-container">
                <YouTube
                  videoId={this.state.youTubeVideoId}
                  opts={this.playerOptions}
                  onEnd={this.onVideoEnd.bind(this)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <Scrollbars style={{ height: 330 }} 
                    renderThumbVertical={({ style, ...props }) =>
                    <div {...props} style={{ ...style, backgroundColor: '#aaaaaa', width: '4px', borderRadius: '3px'}}/>}
              >
                <ul className="list-group track-list playlist-track-list">
                    {this.getTrackList()}
                </ul>
              </Scrollbars>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <SongInfo
                artist={this.props.playlist.tracks[this.state.currentTrack].artist}
                song={this.props.playlist.tracks[this.state.currentTrack].name}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const playlist = state.user.myMusic.playlists.find(playlist => {
    if (playlist._id === props.match.params.playlist_id) {
      return true;
    } else {
      return false;
    }
  })

  return {
    playlist: playlist
  }
}

export default connect(mapStateToProps)(PlaylistPlay);