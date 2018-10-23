import React, { Component } from 'react';
import axios from 'axios';
import settings from '../../settings/index';
import * as sf from '../../modules/shared_funcs';
import { Link } from 'react-router-dom';
import Loader from '../errors_and_loaders/loader';
import ErrorLoadingData from '../errors_and_loaders/error_loading_data';
import ImgWithPreoloader from '../errors_and_loaders/img_with_preloader';
import Fav from '../shared/fav';

export default class TrackInfo extends Component {
  
  constructor(props) {
    super(props);

    this.state = { trackInfo: {}, error: null }
  }

  componentDidMount() {
    this.getTrackInfo();
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.artist !== this.props.artist) || (prevProps.song !== this.props.song)) {
      this.getTrackInfo();
    }
  }

  getTrackInfo() {
    axios.get(`${settings.LastFMApiRootAddr}track.getInfo&artist=${this.props.artist}&track=${this.props.song}&api_key=${settings.LastFMAPIKey}&format=json`).then((response) => {

      if (response.data.error) {
        this.setState({ error: response.data.message })
      } else {
        this.setState({ trackInfo: response.data })
      }
      
    });
  }

  getAbout() {
    if (!this.state.trackInfo.track.wiki) return null;

    let about = this.state.trackInfo.track.wiki.summary;
    about = about.replace(/(?:\r\n|\r|\n)/g, '<br>');

    if (about.indexOf('<a href=') !== -1) {
      about = about.substring(0, about.indexOf('<a href='));
    }

    if (about.trim() !== '') {
      return (
        <tr>
          <th>About</th>
          <td dangerouslySetInnerHTML={{__html: about}}></td>
        </tr>
      )
    }
 
    return null;
  }

  render() {

    if (this.state.error) {
      return <ErrorLoadingData error={this.state.error}/>
    }

    if (sf.isObjectEmpty(this.state.trackInfo)) {
      return <Loader/>
    }
    
    const trackInfo = this.state.trackInfo.track;

    return (
    <div className="row">
      <div className="col-12 col-sm-3">
        <ImgWithPreoloader maxWidth={300} maxHeight={300} classes='mr-3 mb-3' 
        src={trackInfo.album ? trackInfo.album.image[2]['#text'] : ''} alt={trackInfo.name} />
      </div>
      <div className="col-12 col-sm-9">
          <div className="clearfix">
            <h5 className="mt-0 float-left">{trackInfo.name}</h5>
            <div className="float-right" style={{marginTop: '-5px'}}>
              <Fav favType='Song' artistName={trackInfo.artist.name} songName={trackInfo.name} albumName={trackInfo.album ? trackInfo.album.title : ''}  />
            </div>
          </div>
          <table className="table">
            <tbody>
              <tr>
                <th>Duration</th>
                <td>{sf.millisToMinutesAndSeconds(trackInfo.duration)}</td>
              </tr>
              <tr>
                <th>Artist</th>
                <td>
                  <Link to={`/artist/${encodeURIComponent(trackInfo.artist.name)}`}>
                    {trackInfo.artist.name}
                  </Link>
                  <Fav favType='Artist' artistName={trackInfo.artist.name}/>
                </td>
              </tr>
              {
                trackInfo.album ?
                <tr>
                  <th>Album</th>
                  <td>
                    <Link to={`/album/${encodeURIComponent(trackInfo.artist.name)}/${encodeURIComponent(trackInfo.album.title)}`}>
                      {trackInfo.album.title}
                    </Link>
                    <Fav favType='Album' artistName={trackInfo.artist.name} albumName={trackInfo.album.title} />
                  </td>
                </tr>
                : null
              }
              
              {this.getAbout()}
            </tbody>
          </table>
      </div>
    </div>
    );
  }
}
