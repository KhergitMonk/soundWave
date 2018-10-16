const mongoose = require('mongoose');

var ArtistSchema = new mongoose.Schema({
  imgUrl: String,
  name: String,
})

var AlbumSchema = new mongoose.Schema({
  imgUrl: String,
  artist: String,
  name: String
})

var TrackSchema = new mongoose.Schema({
  imgUrl: String,
  artist: String,
  name: String,
  lengthMilis: Number
})

var PlaylistSchema = new mongoose.Schema({
  name: String,
  tracks: [TrackSchema]
})


var UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  myMusic: {
    artists: [ArtistSchema],
    albums: [AlbumSchema],
    tracks: [TrackSchema],
    playlists: [PlaylistSchema]
  }
})

var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;


