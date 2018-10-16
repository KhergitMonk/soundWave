const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('./data_models/user');
const CheckAuthMiddleware = require('./check-auth');
const settings = require('./settings');
const path = require ('path');

//Mongoose
mongoose.connect(settings.MongoDBConnectionString, { useNewUrlParser: true }).then(()=>{
  console.log('Connected to database!')
}).catch(() => {
  console.log('Error connecting to database');
});
mongoose.set('useCreateIndex', true); //supress error "DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead."

//BODY PARSER
//app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 

//Check auth
app.use(CheckAuthMiddleware);

//Allow CORS
app.use((req , res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
})

/*********************** SIGNUP / LOGIN ****************************************/
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailValid = re.test(String(email).toLowerCase());
  if ((!email) || (!emailValid)) {
    return false;
  } 
  return true;
}

function validatePassword(password) {
  if ((!password) || (password.length < 7)) {
    return false;
  }
  return true;
}

function removeIDsFromMyMusic(myMusic) {
  let myMusicCopy = JSON.parse(JSON.stringify(myMusic));

  myMusicCopy.artists = myMusicCopy.artists.map(artist => {
    delete(artist._id);
    return artist;
  })

  myMusicCopy.albums = myMusicCopy.albums.map(album => {
    delete(album._id);
    return album;
  })

  myMusicCopy.tracks = myMusicCopy.tracks.map(track => {
    delete(track._id);
    return track;
  })

  return myMusicCopy;
}

app.post('/signup', (req, res) => {
  
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  //Validate inputs
  if (!validateEmail(email) || !validatePassword(password)) {
    res.send({
      error: 'Invalid email or password format'
    })
  }

  //Check if user exists
  UserModel.find({ email: email }).then(response => {
    if (response.length > 0) {//found user with that email
      res.send({
        error: 'Provided email already exists in the database'
      })
    } else { //User does not exist - we can create one
      bcrypt.hash(password, 10).then(hash => {
        UserModel.create({
          username: username,
          email: email,
          password: hash
        }).then(createdRecord => {
          res.send({
            success: true
          })
        }).catch(error => {
          res.send({
            error: 'Unknown error during user creation'
          })
        });
      })
    }
  })
})

app.post('/login', (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;

  //Validate inputs
  if (!validateEmail(email) || !validatePassword(password)) {
    res.send({
      error: 'Invalid email or password format'
    })
  }

  //Check if user exists
  UserModel.find({ email: email },'-_id').then(response => {
      //found user with that email - check password
      if (response.length > 0) {

        const userFromDB = response[0];

        bcrypt.compare(password, userFromDB.password).then((areTheSame) => {
          if (areTheSame === true) { //found user
          
            const userDataForJWT = {
              id: userFromDB._id,
              username: userFromDB.username,
              email: userFromDB.email
            }

            const token = jwt.sign(userDataForJWT, settings.JWTSecret, {
              expiresIn: 60 * 60 * 24 // expires in 24 hours
            });

            res.send({
              success: true,
              username: userFromDB.username,
              token: token,
              myMusic: removeIDsFromMyMusic(userFromDB.myMusic)
            })

          } else {
            res.send({
              error: 'Invalid email or password'
            })
          }
        })
      } else {
        res.send({
          error: 'Invalid email or password'
        })
      }
    }
  ).catch((error) => {
    res.send({
      error: 'Unknown error during login'
    })
  }) 
})

app.post('/validate_token', (req, res) => {
  
  const token = req.body.token;

  jwt.verify(token, settings.JWTSecret, function(err, user) {
    if (err) {
      res.status(401).send({
        error: 'Token invalid',
      });
    } else {
      UserModel.find({ email: user.email })
      .then(usersFromDB => {

        if (usersFromDB.length > 0) {
          res.send({
            tokenValid: true,
            username: usersFromDB[0].username,
            myMusic: removeIDsFromMyMusic(usersFromDB[0].myMusic)
          });
        } else {
          res.status(401).send({
            error: 'User not found',
          });
        }
      })
      .catch((err) => {
        res.status(401).send({
          error: 'DB error',
        });
      }) 
    }
  })

})

/*********************** MY MUSIC ****************************************/

//Add artist
app.post('/mymusic/artist', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const name = req.body.name;
    const imgUrl = req.body.imgUrl;

    UserModel.findOneAndUpdate({ email: email }, {$push: {'myMusic.artists': { name: name , imgUrl: imgUrl }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Remove artist
app.delete('/mymusic/artist/:name', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const name = req.params.name;

    UserModel.findOneAndUpdate({ email: email }, {$pull: {'myMusic.artists': { name: name }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Add album
app.post('/mymusic/album', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const artist = req.body.artist;
    const name = req.body.name;
    const imgUrl = req.body.imgUrl;

    UserModel.findOneAndUpdate({ email: email }, {$push: {'myMusic.albums': { artist: artist, name: name , imgUrl: imgUrl }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Remove album
app.delete('/mymusic/album/:artist/:name', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const artist = req.params.artist;
    const name = req.params.name;

    UserModel.findOneAndUpdate({ email: email }, {$pull: {'myMusic.albums': { artist: artist, name: name }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})


//Add track
app.post('/mymusic/track', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const artist = req.body.artist;
    const name = req.body.name;
    const imgUrl = req.body.imgUrl;
    const lengthMilis = req.body.lengthMilis;

    UserModel.findOneAndUpdate({ email: email }, {$push: {'myMusic.tracks': { 
      artist: artist, 
      name: name, 
      imgUrl: imgUrl, 
      lengthMilis: lengthMilis 
    }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Remove track
app.delete('/mymusic/track/:artist/:name', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const artist = req.params.artist;
    const name = req.params.name;

    UserModel.findOneAndUpdate({ email: email }, {$pull: {'myMusic.tracks': { artist: artist, name: name }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Add playlist
app.post('/mymusic/playlist', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const name = req.body.name;

    UserModel.findOneAndUpdate({ email: email }, {$push: {'myMusic.playlists': { name: name }}}, {new: true})
    .then((response) => {
      const newPlaylistdId = response.myMusic.playlists[response.myMusic.playlists.length - 1]._id;
      res.send({
        playlistId: newPlaylistdId,
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error: ' + err
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Remove playlist
app.delete('/mymusic/playlist/:playlist_id', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const playlistId = req.params.playlist_id;

    UserModel.findOneAndUpdate({ email: email }, {$pull: {'myMusic.playlists': { _id: playlistId }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Modify playlist
app.put('/mymusic/playlist/:playlist_id', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const playlistId = req.params.playlist_id;
    const playlistData = req.body.playlistData;

    UserModel.findOneAndUpdate({ email: email, 'myMusic.playlists._id': playlistId }, {$set: {'myMusic.playlists.$': playlistData}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Add track to playlist
app.post('/mymusic/playlist/track', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const playlistId = req.body.playlistId;
    const artist = req.body.artist;
    const name = req.body.name;
    const imgUrl = req.body.imgUrl;
    const lengthMilis = req.body.lengthMilis;

    UserModel.findOneAndUpdate({ email: email, 'myMusic.playlists._id': playlistId }, {$push: {'myMusic.playlists.$.tracks': { 
      artist: artist, 
      name: name, 
      imgUrl: imgUrl, 
      lengthMilis: lengthMilis 
    }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//Remove track from playlist
app.delete('/mymusic/playlist/track/:playlistId/:artist/:name', (req, res) => {
  if (req.userData.email) {
    const email = req.userData.email;
    const playlistId = req.body.playlistId;
    const artist = req.params.artist;
    const name = req.params.name;

    UserModel.findOneAndUpdate({ email: email, 'myMusic.playlists.id': playlistId }, {$pull: {'myMusic.playlists.$.tracks': { artist: artist, name: name }}})
    .then((response) => {
      res.send({
        error: false
      });
    })
    .catch((err) => {
      res.status(401).send({
        error: 'DB error'
      });
    }) 

  } else {
    res.send({
      error: 'Unauthorized'
    });
  }
})

//All other routes need to serve index.html
app.use(express.static(__dirname + '/../dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/../dist/index.html'))
});

/** START SERVER */
app.listen(settings.ServerPort,() => {
  console.log('Server running at port ' + settings.ServerPort)
})