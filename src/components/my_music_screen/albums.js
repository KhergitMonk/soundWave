import React, { Component } from "react";
import { connect } from 'react-redux';
import Pagination from "react-js-pagination"; 
import ArtistAlbumCard from '../shared/artist_album_card';

class MyMusicAlbums extends Component {
  constructor(props) {
    super(props);
    this.resultsPerPage = 8; 
    this.state = { page: 1 }
  }

  render() {

    if (this.props.albums.length === 0) {
      return (
        <div className="text-center m-5">
          <h3>You have no favourite albums selected yet</h3>
          <br/>
          <h5>You can add favourite albums from various places in the app - for example you can try the search function </h5>
        </div>
      )
    }

    const albumsToSkip = (this.state.page - 1) * this.resultsPerPage;
    const albumsToDisplay = this.props.albums.slice(albumsToSkip, albumsToSkip + this.resultsPerPage );

    const albumCards = albumsToDisplay.map((album, index) => { 
      
      const elementKey = ((this.state.page - 1) * this.resultsPerPage) + index;
      
      return <ArtistAlbumCard 
        key={elementKey} 
        linkTo={`/album/${album.artist}/${encodeURIComponent(album.name)}`} 
        imgSrc={album.imgUrl}
        albumName={album.name}
        artistName={album.artist}
        fromMyMusic={true}
        />
    })

    return (
      <div>
        <div className="row">
          {albumCards}
        </div>
        {
          Math.ceil(this.props.albums.length / this.resultsPerPage) > 1 ? 
          <Pagination
            activePage={this.state.page}
            itemsCountPerPage={this.resultsPerPage}
            totalItemsCount={this.props.albums.length}
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
    albums: state.user.myMusic.albums
  }
}

export default connect(mapStateToProps)(MyMusicAlbums);