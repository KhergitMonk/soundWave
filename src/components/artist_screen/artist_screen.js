import React, { Component } from "react";
import settings from "../../settings/index";
import axios from "axios";
import { Scrollbars } from 'react-custom-scrollbars';
import { isObjectEmpty } from '../../modules/shared_funcs';
import Loader from '../errors_and_loaders/loader';
import ArtistAlbums from './artist_albums';
import SimilarArtists from './similar_artists';
import ArtistTopTracks from './artist_top_tracks';
import ImgWithPreloader from '../errors_and_loaders/img_with_preloader';
import ErrorLoadingData from '../errors_and_loaders/error_loading_data';
import Fav from '../shared/fav';

export default class ArtistScreen extends Component {
  constructor(props) {
    super(props);

    this.albumsComponent = '';
    this.similarArtistsComponent = '';
    this.topTracksComponent = '';
    
    this.state = { artistInfo: {}, bioExpanded: false, selectedTab: '', error: null }
  }

  componentDidMount() {
    this.resetComponent();
    this.getArtistInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.artist !== this.props.match.params.artist) {
      this.getArtistInfo()
      this.resetComponent();
    }
  }

  getArtistInfo() {
    axios.get(`${settings.LastFMApiRootAddr}artist.getinfo&artist=${this.props.match.params.artist}&api_key=${settings.LastFMAPIKey}&format=json`).then((response) => {

      if (response.data.error) {
        this.setState({ error: response.data.message })
      } else {
        this.setState({ artistInfo: response.data.artist })
      }

    });
  }

  resetComponent(){
    this.albumsComponent = '';
    this.similarArtistsComponent = '';
    this.topTracksComponent = '';
    this.setState({bioExpanded: false})
    this.selectArtistInfoTab('Albums'); 
  }

  getBio() {
    const artistInfo = this.state.artistInfo;
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
      bio = 'No bio is avaiailable for this artist';
    }

    return bio;
  }

  getBioMoreInfoButton() {
    if ((!this.state.artistInfo.bio.content) || (this.state.artistInfo.bio.content === this.state.artistInfo.bio.summary)) {
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

  selectArtistInfoTab(selectTab) {
    this.setState({ selectedTab: selectTab  });

    if ((selectTab === 'Albums') && (this.albumsComponent === '')) {
      this.albumsComponent = <ArtistAlbums artist={this.props.match.params.artist}/>
    }

    if ((selectTab === 'Similar artists') && (this.similarArtistsComponent === '')) {
      this.similarArtistsComponent = <SimilarArtists artist={this.props.match.params.artist}/>
    }

    if ((selectTab === 'Top tracks') && (this.topTracksComponent === '')) {
      this.topTracksComponent = <ArtistTopTracks artist={this.props.match.params.artist}/>
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorLoadingData error={this.state.error}/>
    }

    if (isObjectEmpty(this.state.artistInfo)) {
      return <Loader/>
    }

    const artistInfo = this.state.artistInfo;

    return (
      <div className="card artist-screen">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <h5>Artist information</h5>
            </div>
          </div>
          <hr/>
          <div className="row">
              <div className="col-md-12 mb-4">
                <h4 className="float-left">{artistInfo.name}</h4>
                <Fav favType='Artist' artistName={artistInfo.name}/>
              </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <ImgWithPreloader
                maxWidth={300}
                maxHeight={300}
                classes='m-3 rounded mx-auto d-block shadow img-fluid'
                src={artistInfo.image[4]["#text"]}
                alt={artistInfo.name}
              />
            </div>
            <div className="col-md-8">
              <Scrollbars style={{ height: 300 }} 
                  renderThumbVertical={({ style, ...props }) =>
                  <div {...props} style={{ ...style, backgroundColor: '#aaaaaa', width: '4px', borderRadius: '3px'}}/>}
              >
                <div className="bio" dangerouslySetInnerHTML={{__html: this.getBio()}}></div>
                { this.getBioMoreInfoButton() }
              </Scrollbars>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 mt-3">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" onClick={ () => { this.selectArtistInfoTab('Albums') } }>
                  <a className={ this.state.selectedTab === 'Albums' ? "nav-link active" : "nav-link" } 
                  id="profile-tab" data-toggle="tab" role="tab" aria-controls="Albums" aria-selected="false">Albums</a>
                </li>
                <li className="nav-item" onClick={ () => { this.selectArtistInfoTab('Similar artists') } }>
                  <a className={ this.state.selectedTab === 'Similar artists' ? "nav-link active" : "nav-link" } 
                  id="profile-tab" data-toggle="tab" role="tab" aria-controls="Similar artists" aria-selected="false">Similar artists</a>
                </li>
                <li className="nav-item" onClick={ () => { this.selectArtistInfoTab('Top tracks') }}>
                  <a className={ this.state.selectedTab === 'Top tracks' ? "nav-link active" : "nav-link" } 
                  id="home-tab" data-toggle="tab" role="tab" aria-controls="Top tracks" aria-selected="true">Top tracks</a>
                </li>
              </ul>
              <div id="albumsContent"
              className={ this.state.selectedTab === 'Albums' ? "tab-content p-3" : "tab-content p-3  d-none" } >
                { this.albumsComponent }
              </div>
              <div id="similarArtistsContent"
              className={ this.state.selectedTab === 'Similar artists' ? "tab-content p-3" : "tab-content p-3  d-none" } >
                { this.similarArtistsComponent }
              </div>
              <div id="topTracksContent"
              className={ this.state.selectedTab === 'Top tracks' ? "tab-content p-3" : "tab-content p-3  d-none" } >
                { this.topTracksComponent }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
