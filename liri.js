const dotEnv = require("dotenv").config();
const axios = require('axios');
const fs = require('fs');
const Spotify = require('node-spotify-api');
var moment = require('moment');
const keys = require("./keys");

function operations() {
    liriActions = {
        "spotify-this-song": function (str) {
            const spotify = new Spotify({
                id: keys.spotify.id,
                secret: keys.spotify.secret
            });
            spotify
                .search({ type: 'track', query: (str || 'The Sign Ace of Base'), limit: 1 })
                .then(function (response) {
                    console.log('Artist: ' + response.tracks.items[0].album.artists[0].name);
                    console.log('Song Name: ' + response.tracks.items[0].name);
                    console.log('Album Name: ' + response.tracks.items[0].album.name);
                    console.log('Preview: ' + response.tracks.items[0].preview_url);
                })
                .catch(function (err) {
                    console.log(err);
                });
        },
        "concert-this": function (str) {
            axios.get('https://rest.bandsintown.com/artists/' + str + '/events?app_id=codingbootcamp')
                .then(function (response) {
                    console.log('Venue Name: ' + response.data[0].venue.name);
                    console.log('Venue Location: ' + response.data[0].venue.city + ", " + response.data[0].venue.country);
                    console.log('Event Date: ' + moment(response.data[0].datetime).format("MM/DD/YYYY"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        "movie-this": function (str) {
            axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + (str || 'Mr. Nobody'))
                .then(function (response) {
                    // console.log('API Response: '+response[0].lineup);
                    console.log('Title: ' + response.data.Title);
                    console.log('Year: ' + response.data.Year);
                    console.log('IMDB Rating: ' + response.data.imdbRating);
                    console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[0].Value);
                    console.log('Country: ' + response.data.Country);
                    console.log('Language: ' + response.data.Language);
                    console.log('Plot: ' + response.data.Plot);
                    console.log('Actors: ' + response.data.Actors);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        "do-what-it-says": function () {
            var str = fs.readFileSync('./randon.txt', 'utf8');
            const spotify = new Spotify({
                id: keys.spotify.id,
                secret: keys.spotify.secret
            });
            spotify
                .search({ type: 'track', query: (str || 'The Sign'), limit: 1 })
                .then(function (response) {
                    console.log('Artist: ' + response.tracks.items[0].album.artists[0].name);
                    console.log('Song Name: ' + response.tracks.items[0].name);
                    console.log('Album Name: ' + response.tracks.items[0].album.name);
                    console.log('Preview: ' + response.tracks.items[0].preview_url);
                })
                .catch(function (err) {
                    console.log(err);
                });
        },
    }
}


operations();
if (process.argv.length === 3) {
    console.log(liriActions[process.argv[2]]());
} else if (process.argv.length === 2) {
    console.log('\nHow to use Liri: \n\nnode liri.js, then type in one of the commands below: \n\nconcert-this <artist name> \nspotify-this-song <song name> \nmovie-this <movie name> \ndo-what-it-says');
} else {
    console.log(liriActions[process.argv[2]](process.argv.slice(3)))
}

fs.appendFileSync('LiriLog.txt', '\nCommand : ' + (process.argv[2] || 'No Command') + " || Value: " + (process.argv.slice(3).join(' ') || 'Default Value'));