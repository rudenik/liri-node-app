require('dotenv').config();
var keys = require('./keys');
var fs = require('fs');
var spotifyAPI = require('node-spotify-api');
var twitterAPI = require('twitter');
var requests = require('request');
var moment = require('moment');

const noSongSpecified = "The Sign"
const noMovieSpecified = "Mr. Nobody"

var spotify = new spotifyAPI(keys.spotify);
var tClient = new twitterAPI(keys.twitter);

var acceptedCmds = ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
var args = process.argv;
var cmd = acceptedCmds.indexOf(args[2]);
runThisNode(cmd, args[3]);

function runThisNode(command, searched){


switch (command){
    case 0:
    console.log("Twitter");
    var params = {screen_name: 'thelargechild'};
    tClient.get('statuses/user_timeline', params, function(error, tweets, response){
        if(!error){
            // console.log(tweets);
            // console.log(response);
            for (ele in tweets){
                console.log("Tweeted At: " + tweets[ele].created_at);
                console.log("The Tweet Said: \n" + tweets[ele].text);
            }
        }else{
            console.log(error);
        }
        logQuery("Twitter", "My Tweets", "tweets - 20");
    });

    break;
    case 1:
    // console.log("Spotify");
    var searchTerm=searched;
    if(!searched){
        searchTerm="The Sign ace of base"
    }
    spotify.search({ type: 'track', query: searchTerm, limit: 1}, function(err, data){
        if(err){
            return console.log("Error occurred: " +err);
        }
        var artist = JSON.stringify(data.tracks.items[0].album.artists[0].name);
        var songName = JSON.stringify(data.tracks.items[0].name);
        var albumName = JSON.stringify(data.tracks.items[0].album.name);
        var preview = JSON.stringify(data.tracks.items[0].preview_url);
        preview = preview.slice(1, -1);
        var stringToPrint = "\nYour Search resulted with the following results \n" +
            "Artist Name: " + artist +
            "\nSong Name: " + songName +
            "\nAlbum Name: " + albumName + 
            "\nSong Preview Url\n" + preview + "\n";
        console.log(stringToPrint);
        logQuery("Spotify", searchTerm, stringToPrint);
    })

    break;
    case 2:
    console.log("OMDB");
    var searchTerm=searched;
    if(!searched){
        searchTerm="Mr. Nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=8252a0f9";
    requests(queryUrl, function(error, response, body) {
        if(!error){
            var ratings = JSON.parse(body).Ratings;
            var rTomatoes = ratings.filter(function(item) {
                return (item.Source === "Rotten Tomatoes");
            });
            var imdbRating = ratings.filter(function(item) {
                return (item.Source === "Internet Movie Database");
            });
            var stringToPrint = "\nTitle: " + JSON.parse(body).Title + "\n" +
            "Year: " + JSON.parse(body).Year + "\n" +
            "Rotten Tomatoes Rating: " + rTomatoes[0].Value + "\n" +
            "IMDB Rating: " + imdbRating[0].Value  + "\n" +
            "Country: " + JSON.parse(body).Country + "\n" +
            "Language: " + JSON.parse(body).Language + "\n" +
            "Plot: " + JSON.parse(body).Plot + "\n" +
            "Actors: " + JSON.parse(body).Actors + "\n";
            console.log(stringToPrint);
            logQuery("OMDB", searchTerm, stringToPrint);
        }else{
            console.log("OMDB Error: " + error);
        }
        
    });

    break;
    case 3:
    console.log("readFile");
    fs.readFile("random.txt", "UTF-8", function(err, data){
        if(!err){
            var myFile = data
            var twoTerms = myFile.split(",");

            runThisNode(acceptedCmds.indexOf(twoTerms[0]), twoTerms[1]);
            // console.log(twoTerms);
        }else{
            console.log(err);
        }
        
    })


    break;

}
}

function logQuery(service, queryTerm, result){
    var stringToLog=("\nUsed " + service + " to search for: " + queryTerm + "\n"+ "The Result was: " + result + "\n"+moment().format('MMMM Do YYYY, h:mm:ss a') + "\n" );
    fs.appendFile("log.txt", stringToLog, "UTF-8", function(err){
        if (err){
            console.log(err);
        }else{
            console.log("Updated log File");
        }
    } )
}