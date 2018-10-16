import React, { Component } from "react";
import { connect } from 'react-redux';
import Pagination from "react-js-pagination"; 
import ArtistAlbumCard from '../shared/artist_album_card';

class MyMusicArtists extends Component {
  constructor(props) {
    super(props);
    this.resultsPerPage = 8; 
    this.state = { page: 1 }
  }

  render() {

    if (this.props.artists.length === 0) {
      return (
        <div className="text-center m-5">
          <h3>You have no favourite artists selected yet</h3>
          <br/>
          <h5>You can add favourite artists from various places in the app - for example you can try the search function </h5>
        </div>
      )
    }


    const artistsToSkip = (this.state.page - 1) * this.resultsPerPage;
    const artistsToDisplay = this.props.artists.slice(artistsToSkip, artistsToSkip + this.resultsPerPage );

    const artistCards = artistsToDisplay.map((artist, index) => { 
      
      const elementKey = ((this.state.page - 1) * this.resultsPerPage) + index;
      
      return <ArtistAlbumCard 
        key={elementKey} 
        linkTo={`/artist/${encodeURIComponent(artist.name)}`} 
        imgSrc={artist.imgUrl}
        artistName={artist.name}
        fromMyMusic={true}
        />
    })

    return (
      <div>
        <div className="row">
          {artistCards}
        </div>
        {
          Math.ceil(this.props.artists.length / this.resultsPerPage) > 1 ?  
          <Pagination
            activePage={this.state.page}
            itemsCountPerPage={this.resultsPerPage}
            totalItemsCount={this.props.artists.length}
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
    artists: state.user.myMusic.artists
  }
}

export default connect(mapStateToProps)(MyMusicArtists);