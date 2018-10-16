import React, { Component } from "react";
import { connect } from 'react-redux';
import Pagination from "react-js-pagination"; 
import ImgWithPreloader from '../errors_and_loaders/img_with_preloader';
import { millisToMinutesAndSeconds } from '../../modules/shared_funcs';
import { Link } from 'react-router-dom';
import trashIcon from '../../../assets/trash.png';
import { removeTrackAsync } from '../../actions/user';

class MyMusicTracks extends Component {
  constructor(props) {
    super(props);
    this.resultsPerPage = 10; 
    this.state = { page: 1 }
  }

  removeTrack(event, artist, name) {
    event.preventDefault();
    this.props.removeTrackAsync(artist, name);
  }

  render() {

    if (this.props.tracks.length === 0) {
      return (
        <div className="text-center m-5">
          <h3>You have no favourite tracks selected yet</h3>
          <br/>
          <h5>You can add favourite tracks from various places in the app - for example you can try the search function </h5>
        </div>
      )
    }

    const tracksToSkip = (this.state.page - 1) * this.resultsPerPage;
    const tracksToDisplay = this.props.tracks.slice(tracksToSkip, tracksToSkip + this.resultsPerPage );

    const trackLines = tracksToDisplay.map((track, index) => { 

      const elementKey = ((this.state.page - 1) * this.resultsPerPage) + index;

      return (
      <li key={elementKey} className="list-group-item clear-fix track-list-item">
        <Link to={`/song/${encodeURIComponent(track.artist)}/${encodeURIComponent(track.name)}`}>
          <div className="media">
            <ImgWithPreloader 
              maxWidth={34}
              maxHeight={34}
              src={track.imgUrl} 
              classes="mr-3 track-list-item-img" 
              alt={track.name}
            />
            <div className="media-body">
              <strong>{track.artist}</strong> - {track.name}
              <img className="track-list-item-delete-icon float-right" src={trashIcon} onClick={(event) => { this.removeTrack(event, track.artist, track.name) }}/>
              <div className="float-right">{millisToMinutesAndSeconds(track.lengthMilis)}</div>
            </div>
          </div>
        </Link>
      </li> 
      )

    })

    return (
      <div>
        <ul className="list-group">
          {trackLines}
        </ul>
        {
          Math.ceil(this.props.tracks.length / this.resultsPerPage) > 1 ?
          <Pagination
            activePage={this.state.page}
            itemsCountPerPage={this.resultsPerPage}
            totalItemsCount={this.props.tracks.length}
            pageRangeDisplayed={5}
            onChange={(pageNo) => {this.setState({ page: pageNo })}}
            itemClass='page-item'
            linkClass='page-link'
          /> : null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tracks: state.user.myMusic.tracks
  }
}

export default connect(mapStateToProps, { removeTrackAsync })(MyMusicTracks);