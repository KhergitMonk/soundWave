import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import settings from '../../settings/index';
import { isObjectEmpty } from '../../modules/shared_funcs';
import Loader from '../errors_and_loaders/loader';
import ErrorLoadingData from '../errors_and_loaders/error_loading_data';
import ImgWithPreoloader from '../errors_and_loaders/img_with_preloader';
import Fav from '../shared/fav';

export default class ArtistInfo extends Component {
  
  constructor(props) {
    super(props);

    this.state = { bioExpanded: false, artistInfo: {}, error: null }
  }

  componentDidMount() {
    axios.get(`${settings.LastFMApiRootAddr}artist.getinfo&artist=${this.props.artist}&api_key=${settings.LastFMAPIKey}&format=json`).then((response) => {

      if (response.data.error) {
        this.setState({ error: response.data.message })
      } else {
        this.setState({ artistInfo: response.data })
      }
    });
  }

  getBio() {

    const artistInfo = this.state.artistInfo.artist;
    let bio = '';

    if (this.state.bioExpanded === false) {
      bio = artistInfo.bio.summary;
    } else {
      bio = artistInfo.bio.content;
    }

    bio = bio.replace(/(?:\r\n|\r|\n)/g, '<br>');

    if (bio.indexOf('<a href=') !== -1) {
      bio = bio.substring(0, bio.indexOf('<a href='));
    }

    if (bio.trim() === '') {
      bio = 'Unfortunately we have no information about this artist';
    }

    return bio;
  }
  
  getBioMoreInfoButton() {
    if ((!this.state.artistInfo.artist.bio) || (!this.state.artistInfo.artist.bio.content)) {
      return null;
    }

    if (!this.state.bioExpanded) {
      return (
        <button type="button" className="btn btn-light float-right mt-3" 
        onClick={ () => this.setState({ bioExpanded: true }) }>
          More info...
        </button>
      )
    }

    return null;
  }

  render() {

    if (this.state.error) {
      return <ErrorLoadingData error={this.state.error}/>
    }

    if (isObjectEmpty(this.state.artistInfo)) {
      return <Loader/>
    }
    
    const artistInfo = this.state.artistInfo.artist;

    return (
    <div className="row">
      <div className="col-12 col-sm-3">
        <ImgWithPreoloader maxWidth={300} maxHeight={300} classes='mr-3 mb-3' src={artistInfo.image[2]['#text']} alt={artistInfo.name} />
      </div>
      <div className="col-12 col-sm-9">
          <div className="clearfix mb-3">
            <h5 className="mt-0 float-left">
              <Link to={`/artist/${encodeURIComponent(artistInfo.name)}`}>
                {artistInfo.name} 
              </Link>
            </h5>
            <Fav favType='Artist' artistName={artistInfo.name}/>
          </div>
          <div className="bio" dangerouslySetInnerHTML={{__html: this.getBio()}}></div>
          { this.getBioMoreInfoButton() }
      </div>
    </div>
    );
  }


}
