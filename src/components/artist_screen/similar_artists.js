import React, { Component } from "react";
import Pagination from "react-js-pagination";
import axios from "axios";
import settings from "../../settings/index";
import ArtistAlbumCard from '../shared/artist_album_card';
import Loader from '../errors_and_loaders/loader';
import NoResults from '../errors_and_loaders/no_results';

export default class SimilarArtists extends Component {
  constructor(props) {
    super(props);

    this.resultsPerPage = 8;
    this.fetchMax = 200;
    this.fetchOverhead = 20;
    
    this.state = { artistsInfo: [], page: 1, totalResults: 0, searchRan: false };
  }

  componentDidMount() {
    this.getArtistsInfo();    
  }

  componentDidUpdate(prevProps) {
    if (prevProps.artist !== this.props.artist) {
      this.setState({ artistsInfo: [], page: 1, totalResults: 0, searchRan: false }, () => { this.getArtistsInfo() })
    }
  }

  getArtistsInfo() {
    axios.get(
      `${settings.LastFMApiRootAddr}artist.getsimilar&artist=${this.props.artist}&api_key=${settings.LastFMAPIKey}&limit=${this.fetchMax + this.fetchOverhead}&format=json`
    )
    .then(response => {

      const artistsInfoRefined = this.refineArtistsInfo(response.data.similarartists.artist);

      this.setState({ 
        artistsInfo: artistsInfoRefined, 
        totalResults: artistsInfoRefined.length, 
        searchRan: true
      });
    });
  }

  refineArtistsInfo(artists) {
    let artistsRefined = artists.filter(artist => {
      if ((!artist) || (artist.name.trim === '') || (artist.name === '(null)')) {
        return false;
      } 
      return true;
    })

    if (artistsRefined.length > this.fetchMax) {
      return artistsRefined.slice(0, this.fetchMax);
    }

    return artistsRefined;
  }

  getPageOfArtists() {
    
    const artistsToSkip = (this.state.page - 1) * this.resultsPerPage;
    const artistsToDisplay = this.state.artistsInfo.slice(artistsToSkip, artistsToSkip + this.resultsPerPage );

    return artistsToDisplay.map((artist, index) => {
      const elementKey = artistsToSkip + index;
      return <ArtistAlbumCard 
          key={elementKey} 
          linkTo={`/artist/${encodeURIComponent(artist.name)}`} 
          imgSrc={artist.image[2]["#text"]}
          artistName={artist.name}
          />
    });
  }

  handlePageChange(toPage) {
    this.setState({ page: toPage });
  }

  render() {
    if (this.state.artistsInfo.length === 0) {
      if (this.state.searchRan === true) {
        return <NoResults/>
      } else {
        return <Loader/>;
      }
    }
    
    return (
      <div>
        <div className="row">{this.getPageOfArtists()}</div>
        <Pagination
          activePage={this.state.page}
          itemsCountPerPage={this.state.resultsPerPage}
          totalItemsCount={this.state.totalResults}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    );
  }
}
