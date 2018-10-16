import React, { Component } from 'react';

export default class RelatedVideo extends Component {
  constructor(props) {
    super(props);
  }

  selectActiveVideo() {
      this.props.changeActiveVideo(this.props.videoData.id.videoId);
  }
 
  render() {
    return (
    <li className="list-group-item related-video" onClick={this.selectActiveVideo.bind(this)}>
      <div className="media">
          <img className="mr-3 thumb" 
          src={this.props.videoData.snippet.thumbnails.default.url} 
          alt={this.props.videoData.snippet.title} />
          <div className="media-body">
              {this.props.videoData.snippet.title}
          </div>
      </div>
    </li>
    );
  }
}
