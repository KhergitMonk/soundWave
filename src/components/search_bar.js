import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import history from '../modules/history'

export default class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.state = { searchType: 'Song', searchFor: '' }
    }
    
    onSearch() {
        if (this.state.searchFor.trim() === '')
        {
            ReactTooltip.show(document.getElementById('searchFor'));
            return false;
        }     

        history.push('/search/' + this.state.searchType + '/' + encodeURIComponent(this.state.searchFor));    
    }

    updateSearchState() {
        //get new search type
        const searchType = document.getElementById('searchType').value;

        //get search string
        const searchFor = document.getElementById('searchFor').value;

        //dispatch state change
        this.setState({ searchType: searchType, searchFor: searchFor });
    }

    onSearchKeypress(event) {
        if (event.charCode === 13) this.onSearch();
    }

    render() {

        return (
        <div className="input-group mb-3 mt-4">
            <input data-tip data-for='searchForInputValidationError' onKeyPress={ this.onSearchKeypress.bind(this) }
            type="text" id="searchFor" className="form-control" placeholder="Search for..." aria-label="Search" 
            value={this.state.artist} onChange={this.updateSearchState.bind(this)}/>
            
            <ReactTooltip id='searchForInputValidationError' type='error' place='bottom' event='nothing' eventOff="click">
                <span>Please enter search string</span>
            </ReactTooltip>

            <div className="input-group-append search-option-select">
                <div className="searchBarWrapper">
                    <select id="searchType" defaultValue={this.state.searchType} 
                    onChange={this.updateSearchState.bind(this)}>
                        <option value="Song">Song</option>
                        <option value="Album">Album</option>
                        <option value="Artist">Artist</option> 
                    </select>
                </div>
            </div>
            <div className="input-group-append">
                <button className="btn btn-success" type="button" onClick={() => this.onSearch()}>Search</button>
            </div>
        </div>
        );
  }
}
