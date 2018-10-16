import React, { Component } from "react";
import Pagination from "react-js-pagination";
import axios from "axios";
import settings from "../../settings/index";
import SearchResult from '../search_result';
import Loader from '../errors_and_loaders/loader';
import ErrorLoadingData from '../errors_and_loaders/error_loading_data';

export default class SimilarTracksInfo extends Component {
  constructor(props) {
    super(props);

    this.resultsPerPage = 10;

    this.state = { similarTracksInfo: [], page: 1, error: null };
  }

  componentDidMount() {
    axios
      .get(
        `${settings.LastFMApiRootAddr}track.getsimilar&artist=${this.props.artist}&track=${this.props.song}&api_key=${settings.LastFMAPIKey}&format=json`
      )
      .then(response => {

        if (response.data.error) {
          this.setState({ error: response.data.message })
        } else {
          this.setState({ similarTracksInfo: response.data.similartracks.track })
        }
      });
  }

  getPageOfSimilarSongResults() {
    const page = this.state.page;
    const skipNo = (page - 1) * this.resultsPerPage;
    const similarOnThisPage = this.state.similarTracksInfo.slice(skipNo,skipNo + this.resultsPerPage);

    return similarOnThisPage.map((track, index) => {

      const elementKey = ((page - 1) * this.resultsPerPage) + index;

      return (
        <SearchResult key={elementKey}
          resultOf='Song'
          link={`/song/${encodeURIComponent(track.artist.name)}/${encodeURIComponent(track.name)}`}
          imgSrc={track.image[1]["#text"]}
          artistName={track.artist.name}
          songName={track.name}
        />
      )

    })
  }

  handlePageChange(toPage) {
    this.setState({ page: toPage });
  }

  render() {
    if (this.state.error) {
      return <ErrorLoadingData error={this.state.error}/>
    }

    if (this.state.similarTracksInfo.length === 0) {
      return <Loader/>;
    }

    return (
      <div>
        <div>
          <ul className="list-group">
            {this.getPageOfSimilarSongResults()}
          </ul>
        </div>
        <Pagination
          activePage={this.state.page}
          itemsCountPerPage={this.resultsPerPage}
          totalItemsCount={this.state.similarTracksInfo.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    );
  }
}
