import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Fav from './shared/fav';
import ImgWithPreloader from './errors_and_loaders/img_with_preloader';

class SearchResult extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { link, imgSrc, artistName, songName, albumName, resultOf  } = this.props;

    let desc = '', alt = '';
    if (resultOf === 'Artist') {
      alt = artistName;
      desc = <span className="search-result-strong">{artistName}</span>;
    }

    if (resultOf === 'Album') {
      alt = albumName;
      desc = <div><span className="search-result-strong">{artistName}</span> - {albumName}</div>
    }

    if (resultOf === 'Song') {
      alt = artistName
      desc = <div><span className="search-result-strong">{artistName}</span> - {songName}</div>
    }

    return (
    <li className="list-group-item clear-fix search-result">
        <Link to={link} className="float-left">
            <div className="media">
              <ImgWithPreloader 
                maxWidth={34} 
                maxHeight={34} 
                classes="mr-3" 
                src={imgSrc} 
                alt={alt}/>
              <div className="media-body">
                  {desc}
              </div>
            </div>
        </Link>
        <Fav favType={this.props.resultOf} artistName={artistName} songName={songName} albumName={albumName}  />
    </li>
    );
  }
}


export default SearchResult; 