import React, { Component } from "react";
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import axios from "axios";
import settings from "../../settings/index";
import Loader from '../errors_and_loaders/loader';
import NoResults from '../errors_and_loaders/no_results';
import playImg from "../../../assets/play.png";

export default class ArtistTopTracks extends Component {
  constructor(props) {
    super(props);

    this.resultsPerPage = 10;
    this.fetchMax = 200;
    this.fetchOverhead = 20;

    this.state = { tracksInfo: [], page: 1, totalResults: 0, searchRan: false };
  }

  componentDidMount() {
    this.getTracksInfo();    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.artist !== this.props.artist) {
      this.setState({ tracksInfo: [], page: 1, totalResults: 0, searchRan: false }, () => { this.getTracksInfo() })
    }
  }

  getTracksInfo() {
    axios.get(
      `${settings.LastFMApiRootAddr}artist.gettoptracks&artist=${this.props.artist}&api_key=${settings.LastFMAPIKey}&limit=${this.fetchMax + this.fetchOverhead}&format=json`
    )
    .then(response => {

      const tracksInfoRefined = this.refineTracksInfo(response.data.toptracks.track);

      this.setState({ 
        tracksInfo: tracksInfoRefined, 
        totalResults: tracksInfoRefined.length, 
        searchRan: false
      });
    });
  }
  
  refineTracksInfo(tracks) {
    let tracksRefined = tracks.filter(track => {
      if ((!track) || (track.name.trim === '') || (track.name === '(null)')) {
        return false;
      } 
      return true;
    })

    if (tracksRefined.length > this.fetchMax) {
      return tracksRefined.slice(0, this.fetchMax);
    }

    return tracksRefined;
  }


  getTracks() {

    const tracksToSkip = (this.state.page - 1) * this.resultsPerPage;
    const tracksToDisplay = this.state.tracksInfo.slice(tracksToSkip, tracksToSkip + this.resultsPerPage );

    return tracksToDisplay.map((track, index) => {
      const elementKey = tracksToSkip + index;
      return (
      <li key={elementKey} className="list-group-item p-2">
        <Link to={`/song/${encodeURIComponent(track.artist.name)}/${encodeURIComponent(track.name)}`}>
            <div>
              <img src={playImg} className="playImg"/> 
              {elementKey + 1}. {track.name}
            </div>
        </Link>
      </li>
      )
    })
  }

  handlePageChange(toPage) {
    this.setState({ page: toPage });
  }

  render() {
    if (this.state.tracksInfo.length === 0) {
      if (this.state.searchRan === true) {
        return <NoResults/>
      } else {
        return <Loader/>;
      }
    }

    return (
      <div>
        <div>
          <ul className="list-group track-list">
            {this.getTracks()}
          </ul>
        </div>
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
