import React, { Component } from "react";
import YTSearch from "youtube-api-search";
import YouTube from "react-youtube"; //https://www.npmjs.com/package/react-youtube
import axios from "axios";
import settings from "../settings/index";
import playImg from "../../assets/play_white.png";
import Loader from './errors_and_loaders/loader';
import * as sf from '../modules/shared_funcs';
import ImgWithPreloader from './errors_and_loaders/img_with_preloader';
import ErrorLoadingData from './errors_and_loaders/error_loading_data';
import SongInfo from "./song_info/song_info.js";
import { Scrollbars } from 'react-custom-scrollbars';

export default class AlbumPlay extends Component {
  constructor(props) {
    super(props);

    this.state = { youTubeVideoId: '', albumInfo: {}, currentTrack: 0, error: null }

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
    const artist = this.props.match.params.artist;
    const album = this.props.match.params.album;

    axios.get(`${settings.LastFMApiRootAddr}album.getinfo&artist=${artist}&album=${album}&api_key=${settings.LastFMAPIKey}&format=json`).then((response) => {

      if (response.data.error) {
        this.setState({ error: response.data.message })
      } else {
        this.setState({ albumInfo: response.data.album }, () => {
          this.youTubeGetVideoID();
        })
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentTrack !== this.state.currentTrack) {
      this.youTubeGetVideoID();
    }
  }

  youTubeGetVideoID() {
    const trackIndex = this.state.currentTrack;
    const searchTerm = this.props.match.params.artist + " " + this.state.albumInfo.tracks.track[trackIndex].name;

    YTSearch({ key: settings.YTSearchKey, term: searchTerm }, videos => {
      this.setState({ youTubeVideoId: videos[0].id.videoId });
    });
  }

  onVideoEnd(event) {
    const nextTrackIndex = this.state.currentTrack + 1;
    if (nextTrackIndex < this.state.albumInfo.tracks.track.length) {//we can open next track
      this.setTrack(nextTrackIndex)
    }
  }

  setTrack(trackIndex) {
    this.setState({ currentTrack: trackIndex });
  }

  getTrackList() {
    let trackList = this.state.albumInfo.tracks.track.map((track, index) => {
      
      let elementClasses = 'list-group-item p-2';
      if (index === this.state.currentTrack) {
        elementClasses += ' active';
      }
      
      return (
      <li key={index} className={elementClasses} onClick={() => { this.setTrack(index) }}>
        <div className="clearfix">
          <div className="float-left"><img src={playImg} className="playImg"/> {index+1}. {track.name}</div>
          <div className="float-right">{sf.secondsToMinutesAndSeconds(track.duration)}</div>
        </div>
      </li>
      )
    })

    return trackList;
  }

  render() {
    if (this.state.error) {
      return <ErrorLoadingData error={this.state.error}/>
    }

    if (sf.isObjectEmpty(this.state.albumInfo)) {
      return <Loader/>
    }

    return (
      <div className="card">
        <div className="card-body"> 
          <div className="row">
            <div className="col-12">
              <div className="media">
                <ImgWithPreloader
                  src={this.state.albumInfo.image[2]["#text"]} 
                  classes={'m-3'}
                  maxWidth={120}
                  maxHeight={120}
                  alt={this.state.albumInfo.name}/>
                <div className="media-body">
                  <div>
                    <h5>Playling album</h5>
                    <h4><strong>{this.state.albumInfo.artist}</strong> - {this.state.albumInfo.name}</h4>
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
                artist={this.props.match.params.artist}
                song={this.state.albumInfo.tracks.track[this.state.currentTrack].name}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

