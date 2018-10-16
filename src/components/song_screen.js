import React, { Component } from "react";
import YTSearch from "youtube-api-search";
import YouTube from "react-youtube"; //https://www.npmjs.com/package/react-youtube
import settings from "../settings/index";
import RelatedVideo from "./related_video.js";
import SongInfo from "./song_info/song_info.js";
import Loader from './errors_and_loaders/loader';
import NoResults from './errors_and_loaders/no_results';

export default class SongScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { videos: [], activeVideoId: '', loading: true }

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
    this.youtTubeSearch();
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.match.params.artist !== this.props.match.params.artist) 
    || (prevProps.match.params.song_name !== this.props.match.params.song_name)) {
      this.youtTubeSearch();
    }
  }

  youtTubeSearch() {
    const searchTerm = decodeURIComponent(this.props.match.params.artist) + " " + decodeURIComponent(this.props.match.params.song_name);

    YTSearch({ key: settings.YTSearchKey, term: searchTerm }, videos => {
      if (videos.length === 0) {
        this.setState({ loading: false })
      } else {
        this.setState({ videos: videos, activeVideoId: videos[0].id.videoId, loading: false  })
      } 
    });
  }

  changeActiveVideo(videoId) {
    this.setState({ activeVideoId: videoId })
  }

  getYTPlayerAndVideos() {
    if (this.state.loading === true) {
      return <Loader/>
    } 

    if ((this.state.loading === false) && (this.state.videos.length === 0))  {
      return <NoResults/>
    } 


    return (
    <div className="row">
      <div className="col-md-8">
        <div className="video-container">
          <YouTube
            videoId={this.state.activeVideoId}
            opts={this.playerOptions}
          />
        </div>
      </div>
      <div className="col-md-4">
        { this.state.videos.map(
          (video) => {
            return <RelatedVideo key={video.id.videoId} videoData={video} changeActiveVideo={ this.changeActiveVideo.bind(this) } />
          })
        }
      </div>
    </div>
    )
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <h5><strong>{this.props.match.params.artist}</strong> - {this.props.match.params.song_name}</h5>
            </div>
          </div>
          <hr/>
          { this.getYTPlayerAndVideos() }
          <div className="row">
            <div className="col-md-12">
              <SongInfo
                artist={this.props.match.params.artist}
                song={this.props.match.params.song_name}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
