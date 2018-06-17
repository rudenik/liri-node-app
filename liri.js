require('dotenv').config();


var spotify = new Spotify(keys.spotify);
var tClient = new Twitter(keys.twitter);

var acceptedCmds = ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
