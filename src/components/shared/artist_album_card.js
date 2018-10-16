import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeArtistAsync, removeAlbumAsync } from '../../actions/user';
import ImgWithPreloader from '../errors_and_loaders/img_with_preloader';
import trashIcon from '../../../assets/trash.png';

class ArtistAlbumCard extends Component {
  constructor(props) {
    super(props);
  }

  removeAlbum(event) {
    event.preventDefault();
    this.props.removeAlbumAsync(this.props.artistName, this.props.albumName)
  }

  removeArtist(event) {
    event.preventDefault();
    this.props.removeArtistAsync(this.props.artistName)
  }

  render () {
    let name = '';
    if (this.props.albumName) name = this.props.albumName;
    if (this.props.artistName) name = this.props.artistName;
    if (this.props.albumName && this.props.artistName) {
      name = <span><strong>{this.props.artistName}</strong> - {this.props.albumName}</span> 
    }

    let deleteIcon = '';
    if (this.props.fromMyMusic === true) {
      if (this.props.albumName) {
        deleteIcon = <img className="artist-album-delete-icon" src={trashIcon} onClick={(event) => this.removeAlbum(event)}/>
      } else {
        deleteIcon = <img className="artist-album-delete-icon" src={trashIcon} onClick={(event) => this.removeArtist(event)}/>
      }
    }

    return (
      <div className="col-12 col-sm-6 col-md-3 mb-2">
        <Link to={this.props.linkTo}>
          <div className="card h-100">
            <div className="artist-album-options-overlay">
              { deleteIcon }
            </div>
            <ImgWithPreloader 
                classes="card-img-top" 
                src={this.props.imgSrc} 
                alt={name}/>
            <div className="card-body">   
              <div>{name}</div>
            </div>
          </div>
        </Link>
      </div>
    )
  } 
}

export default connect(null, { removeArtistAsync, removeAlbumAsync } )(ArtistAlbumCard); 