import React, { Component } from "react";
import Pagination from "react-js-pagination";
import axios from "axios";
import settings from "../../settings/index";
import Loader from '../errors_and_loaders/loader';
import NoResults from '../errors_and_loaders/no_results';
import ArtistAlbumCard from '../shared/artist_album_card';

export default class ArtistAlbums extends Component {
  constructor(props) {
    super(props);

    this.resultsPerPage = 8;
    this.fetchMax = 200;
    this.fetchOverhead = 20;
    
    this.state = { albumsInfo: [], page: 1, totalResults: 0, searchRan: false };
  }

  componentDidMount() {
    this.getAlbumsInfo();    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.artist !== this.props.artist) {
      this.setState({ albumsInfo: [], page: 1, totalResults: 0, searchRan: false }, () => { this.getAlbumsInfo() })
      return;
    }
  }

  getAlbumsInfo() {
    axios.get(
      `${settings.LastFMApiRootAddr}artist.gettopalbums&artist=${this.props.artist}&api_key=${settings.LastFMAPIKey}&limit=${this.fetchMax + this.fetchOverhead}&format=json`
    )
    .then(response => {

      const albumsInfoRefined = this.refineAlbumsInfo(response.data.topalbums.album);

      this.setState({ 
        albumsInfo: albumsInfoRefined, 
        totalResults: albumsInfoRefined.length, 
        searchRan: true
      });
    });
  }

  refineAlbumsInfo(albums) {
    let albumsRefined = albums.filter(album => {
      if ((!album) || (album.name.trim === '') || (album.name === '(null)')) {
        return false;
      } 
      return true;
    })

    if (albumsRefined.length > this.fetchMax) {
      return albumsRefined.slice(0, this.fetchMax);
    }

    return albumsRefined;
  }

  getAlbums() {
    const albumsToSkip = (this.state.page - 1) * this.resultsPerPage;
    const albumsToDisplay = this.state.albumsInfo.slice(albumsToSkip, albumsToSkip + this.resultsPerPage );

    return albumsToDisplay.map((album, index) => {
      const elementKey = albumsToSkip + index;
      return <ArtistAlbumCard 
        key={elementKey} 
        linkTo={`/album/${encodeURIComponent(album.artist.name)}/${encodeURIComponent(album.name)}`} 
        imgSrc={album.image[2]["#text"]}
        albumName={album.name}
        />
    });
  }

  handlePageChange(toPage) {
    this.setState({ page: toPage });
  }

  render() {
    if (this.state.albumsInfo.length === 0) {
      if (this.state.searchRan === true) {
        return <NoResults/>
      } else {
        return <Loader/>;
      }
    }
    
    return (
      <div>
        <div className="row">{this.getAlbums()}</div>
        <Pagination
          activePage={this.state.page}
          itemsCountPerPage={this.resultsPerPage}
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
