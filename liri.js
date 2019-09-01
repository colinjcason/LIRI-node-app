require("dotenv").config();
var axios = require("axios");
var keys = require("./key.js");
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require("fs");


var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var search = process.argv.slice(3).join(" ");

function run() {
    switch(command) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movie();
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function(err, data) {
                if(err) {
                    return console.log(err);
                }

                var output = data.split(",");
                search = output;
                spotifyThis();
            });
            break;
    }
};

function concertThis() {

    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then(function(response) {
        var event = response.data[0];
        console.log("Venue: " + event.venue.name + 
        "\nLocation: " + event.venue.city + ", " + event.venue.region + 
        "\nDate: " + moment(event.datetime).format("MM/DD/YYYY"));
    });
}

function spotifyThis() {

    if(!search) {
        search = "The Sign";
    }

    spotify.search({ type: 'track', query: search, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data.tracks);
      });
}

function movie() {

    if(!search) {
        search = "Mr. Nobody";
    }

    axios.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy").then(function(response) {
        console.log("Title: " + response.data.Title + 
        "\nYear: " + response.data.Year +
        "\nRating: " + response.data.imdbRating + 
        "\nRotten Tomato Rating: " + response.data.rtScore +
        "\nCountry: " + response.data.Country +
        "\nPlot +" + response.data.Plot +
        "\nActors: " + response.data.Actors);
    });
}

run(command);


