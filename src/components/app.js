import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ErrorBoundary from './errors_and_loaders/error_boundary';
import MessagePopup from './errors_and_loaders/message_popup';
import SearchResults from './search_results';
import FourOFour from './errors_and_loaders/fourofour';
import Header from './header';
import Home from './home';
import LoginSignup from './login_signup';
import SearchBar from './search_bar';
import SongScreen from './song_screen';
import AlbumScreen from './album_screen';
import ArtistScreen from './artist_screen/artist_screen';
import AlbumPlay from './album_play';
import PlaylistPlay from './playlist_play';
import MyMusicScreen from './my_music_screen/my_music_screen';


export default class App extends Component {

  render() {
    return (
      <ErrorBoundary>
        <MessagePopup/>
        <Header/>
        <div className="container content-container">
          <SearchBar/>
          <Switch>
            <Route path="/" exact={true} component={ Home }/>
            <Route path="/login" render={()=><LoginSignup loginOrSignup={'login'}/>}/>
            <Route path="/signup" render={()=><LoginSignup loginOrSignup={'signup'}/>}/>
            <Route path="/search/:searchType/:searchFor/:page" component={ SearchResults }/>
            <Route path="/search/:searchType/:searchFor" component={ SearchResults }/>
            <Route path="/song/:artist/:song_name" component={ SongScreen }/>
            <Route path="/album/:artist/:album" component={ AlbumScreen }/>
            <Route path="/artist/:artist" component={ ArtistScreen }/>
            <Route path="/album_play/:artist/:album" component={ AlbumPlay }/>
            <Route path="/mymusic" component={ MyMusicScreen }/>
            <Route path="/playlist_play/:playlist_id" component={ PlaylistPlay }/>
            <Route path="*" component={ FourOFour }/>
          </Switch>
        </div>
      </ErrorBoundary>
    );
  }
}
