import React, { Component } from "react";
import { Link } from "react-router-dom";
import settings from "../settings/index";
import axios from "axios";
import playImg from "../../assets/play_white.png";
import history from '../modules/history'
import Loader from './errors_and_loaders/loader';
import * as sf from '../modules/shared_funcs';
import ImgWithPreloader from './errors_and_loaders/img_with_preloader';
import ErrorLoadingData from './errors_and_loaders/error_loading_data';

export default class AlbumScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { albumInfo: {}, albumDescExpanded: false, error: null }
  }

  componentDidMount() {
    const artist = this.props.match.params.artist;
    const album = this.props.match.params.album;

    axios.get(`${settings.LastFMApiRootAddr}album.getinfo&artist=${artist}&album=${album}&api_key=${settings.LastFMAPIKey}&format=json`).then((response) => {

      if (response.data.error) {
        this.setState({ error: response.data.message })
      } else {
        this.setState({ albumInfo: response.data.album })
      }

    });
  }

  getAlbumDesc() {
    const albumDescSumAndFull = this.state.albumInfo.wiki;

    if (!albumDescSumAndFull) {
      return null;
    }

    let desc = '';

    if (this.state.albumDescExpanded === false) {
      desc = albumDescSumAndFull.summary;
    } else {
      desc = albumDescSumAndFull.content;
    }

    desc = desc.replace(/(?:\r\n|\r|\n)/g, '<br>');

    if (desc.indexOf('<a href=') !== -1) {
      desc = desc.substring(0, desc.indexOf('<a href='));
    }

    return desc;
  }

  getDescMoreInfoButton() {
    if ((!this.state.albumInfo.wiki) || (!this.state.albumInfo.wiki.content)) {
      return null;
    }

    if (!this.state.albumDescExpanded) {
      return (
        <button type="button" className="btn btn-light float-right mt-3" 
        onClick={ () => this.setState({ albumDescExpanded: true }) }>
          More info...
        </button>
      )
    }

    return null;
  }

  getTrackList() {

    if (this.state.albumInfo.tracks.track.length <= 0) {
      return <div className="sorry-no-tracks-info">Sorry, we have no information about tracks on this album</div>
    }

    let trackList = this.state.albumInfo.tracks.track.map((track, index) => {
      return (
      <li key={index} className="list-group-item p-2">
        <Link to={`/song/${this.props.match.params.artist}/${encodeURIComponent(track.name)}`}>
          <div className="clearfix">
            <div className="float-left"><img src={playImg} className="playImg"/> {index+1}. {track.name}</div>
            <div className="float-right">{sf.secondsToMinutesAndSeconds(track.duration)}</div>
          </div>
        </Link>
      </li>
      )
    })

    return <ul className="list-group track-list">{trackList}</ul>;
  }

  onPlayAlbum() {
    const artist = this.props.match.params.artist;
    const album = this.props.match.params.album;

    history.push(`/album_play/${artist}/${album}`);    
  }

  render() {
    if (this.state.error) {
      return <ErrorLoadingData error={this.state.error}/>
    }

    if (sf.isObjectEmpty(this.state.albumInfo)) {
      return <Loader/>
    }

    const albumInfo = this.state.albumInfo;


    return (
      <div className="card album-screen">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <h5>Album information</h5>
            </div>
          </div>
          <hr/>
          <div className="row">
              <div className="col-md-12 mb-4 clearfix">
                <h4 className="float-left">
                <Link to={`/artist/${encodeURIComponent(albumInfo.artist)}`}>
                  {albumInfo.artist}
                </Link> - {albumInfo.name}
                </h4>
                { albumInfo.tracks.track.length>0 ?  
                  <button type="button" className="btn btn-light float-right" onClick={ () => { this.onPlayAlbum() } }>
                    <img src={playImg} className="playImgLarger" /> Play album
                  </button>
                  : null }
              </div>
          </div>
          <div className="row">
            <div className="col-md-6 align-self-center">
                  <ImgWithPreloader 
                    src={albumInfo.image[4]["#text"]} 
                    classes={'mr-3 mb-3 rounded mx-auto d-block img-fluid album-image'}
                    maxWidth={'300'}
                    maxHeight={'300'}
                    alt={albumInfo.name}/>
            </div>
            <div className="col-md-6">
              {this.getTrackList()}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <div className="album-description" dangerouslySetInnerHTML={{__html: this.getAlbumDesc()}}></div>
              { this.getDescMoreInfoButton() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}