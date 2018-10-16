import React, { Component } from 'react';
import Pagination from "react-js-pagination";
import SearchResult from './search_result'; 

import settings from "../settings/index";
import axios from 'axios';
import Loader from './errors_and_loaders/loader';
import NoResults from './errors_and_loaders/no_results';

export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.resultsPerPage = 10;
    this.fetchMax = 200;
    this.fetchOverhead = 20;

    this.state = { 
      searchResults: [], 
      searchType: '', 
      searchFor: '',
      page: 1,
      resultsLoading: true,
      searchRan: false
      }
  }

  componentDidMount() {
    this.searchRun();
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.match.params.searchType !== this.props.match.params.searchType) ||
    (prevProps.match.params.searchFor !== this.props.match.params.searchFor)) {
      this.setState({ resultsLoading: true, searchRan: false }, function(){
        this.searchRun();
      })
    } else {
      if (prevProps.match.params.page !== this.props.match.params.page) {
        this.setState({ page: this.props.match.params.page })
      }
    }
  }

  searchRun() {
    const searchParams = this.props.match.params;
    let page = 1;
    if (typeof searchParams.page !== 'undefined') page = searchParams.page;

    let apiQueryString = '';

    if (searchParams.searchType === 'Song') {
      apiQueryString = 'track.search&track=' + searchParams.searchFor;
    }

    if (searchParams.searchType === 'Album') {
        apiQueryString = 'album.search&album=' + searchParams.searchFor;
    }

    if (searchParams.searchType === 'Artist') {
      apiQueryString = 'artist.search&artist=' + searchParams.searchFor;
    }
    
    axios.get(`${settings.LastFMApiRootAddr}${apiQueryString}&api_key=${settings.LastFMAPIKey}&format=json&limit=${this.fetchMax + this.fetchOverhead}`).then((response) => {
      
      let searchResults;
      if (searchParams.searchType === 'Song') {
        searchResults = this.refineSearchResults(response.data.results.trackmatches.track);
      }
      if (searchParams.searchType === 'Album') {
        searchResults = this.refineSearchResults(response.data.results.albummatches.album);
      }
      if (searchParams.searchType === 'Artist') {
        searchResults = this.refineSearchResults(response.data.results.artistmatches.artist);
      }
    
      this.setState({ 
        searchResults: searchResults, 
        searchFor: decodeURIComponent(searchParams.searchFor), 
        searchType: searchParams.searchType, 
        page: page,
        resultsLoading: false,
        searchRan: true
      })

    });

  }

  refineSearchResults(searchResults) {
    let searchResultsRefined = searchResults.filter(searchResult => {
      if ((!searchResult) || (searchResult.name.trim === '') || (searchResult.name === '(null)')) {
        return false;
      } 
      return true;
    })

    if (searchResultsRefined.length > this.fetchMax) {
      return searchResultsRefined.slice(0, this.fetchMax);
    }

    return searchResultsRefined;
  }

  checkIfSearchResultsExist() {
    if (this.state.searchResults.length === 0) {
      return false;
    }

    return true;
  }

  renderSearchResults() {
    if ((!this.checkIfSearchResultsExist()) && (this.state.searchRan === true)) {
        return <NoResults/>
    }

    const page = this.state.page ? this.state.page : 1;
    const searchResults = this.state.searchResults;
    const searchResultsToSkip = (page - 1) * this.resultsPerPage;
    const searchResultsToDisplay = searchResults.slice(searchResultsToSkip, searchResultsToSkip + this.resultsPerPage );
  
    const searchResultsComponents = searchResultsToDisplay.map((result, index) => {
      const elementKey = ((page - 1) * this.resultsPerPage) + index;
      
      let searchResultProps = {};

      if (this.state.searchType === 'Song') {
        searchResultProps = {
          link: `/song/${encodeURIComponent(result.artist)}/${encodeURIComponent(result.name)}`,
          imgSrc: result.image[0]['#text'],
          artistName: result.artist,
          songName: result.name
        }
      }

      if (this.state.searchType === 'Album') {
        searchResultProps = {
          link: `/album/${encodeURIComponent(result.artist)}/${encodeURIComponent(result.name)}`,
          imgSrc: result.image[0]['#text'],
          albumName: result.name,
          artistName: result.artist
        }
      }

      if (this.state.searchType === 'Artist') {
        searchResultProps = {
          link: `/artist/${encodeURIComponent(result.name)}`,
          imgSrc: result.image[0]['#text'],
          artistName: result.name
        }
      }

      return (
        <SearchResult key={elementKey}
          resultOf={this.state.searchType}
          {...searchResultProps}
        />
      )
    })

    return searchResultsComponents;
  }

  renderPagination() {
    if (!this.checkIfSearchResultsExist()) return;

    let page = 1;
    if (typeof this.state.page !== 'undefined') page = +this.state.page;
    const totalHits = this.state.searchResults.length;
    
    if (+totalHits === 0) return null;

    return (
      <Pagination
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalHits}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
          itemClass='page-item'
          linkClass='page-link'
        />
    );
  }

  handlePageChange(toPage) {

    const toPath = '/search/' 
    + this.state.searchType + '/' 
    + encodeURIComponent(this.state.searchFor) + '/' 
    + toPage;

    this.props.history.push(toPath);   
  }
  
  render() {
    return (
      <div>
        <div className="alert alert-mydark" role="alert">
          Search results for {this.state.searchType.toLowerCase()}, query: "{decodeURIComponent(this.props.match.params.searchFor)}" 
        </div>
        { this.state.resultsLoading ? <Loader absolute={true}/> : null }
        <ul className="list-group">
          {this.renderSearchResults()}
        </ul>
        {this.renderPagination()}
      </div>
    );
  }
}
