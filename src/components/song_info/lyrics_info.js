import React, { Component } from 'react';
import axios from 'axios';
import settings from '../../settings/index';
import Loader from '../errors_and_loaders/loader';
import ErrorLoadingData from '../errors_and_loaders/error_loading_data';

export default class LyricsInfo extends Component {

  constructor(props) {
    super(props);
    console.log('xxx');
    this.state = { lyrics: '', error: null }
  }

  componentDidMount() {
    axios.get('https://orion.apiseeds.com/api/music/lyric/'+this.props.artist+'/'+this.props.song+'?apikey='+settings.APISeedsLyricsKey)
    .then((response) => {
      console.log(response);
      
      this.setState({ lyrics: response.data.result.track.text.replace(/(?:\r\n|\r|\n)/g, '<br>') })
      
    }).catch((error) => {
      this.setState({ error: 'Lyrics not found' })
    });
  }

  render() {
    if (this.state.error) {
      return <ErrorLoadingData error={this.state.error}/>
    }
    
    if (this.state.lyrics === '')
      return <Loader/>;

    return (
    <div>
        <div className="lyrics" dangerouslySetInnerHTML={{__html: this.state.lyrics }}></div>
    </div>
    )
  }
}
