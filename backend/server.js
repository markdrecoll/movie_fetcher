const mongoose = require('mongoose');
require('dotenv').config({path:'../.env'})

const username = process.env.MOVIEDB_USER;
const password = process.env.MOVIEDB_PASSWORD;
const cluster = process.env.MOVIEDB_CLUSTER;
const dbname = process.env.MOVIEDB_DBNAME;

// connect to remote mongodb
mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

// schema for movies
const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    releaseDate: {
        type: String,
        required: false,
    },
    rating: {
        type: Number,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
});
const Movie = mongoose.model('movies', MovieSchema);
Movie.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("Movie picker app backend server is running on port 5000.");
app.use(express.json());
app.use(cors());
app.get("/", (request, response) => {
    response.send(
        "<h2>The server for the movie picker app is now working on port 5000.</h2>"+
        "<h3>You should now be able to utilize the database functionality. If you cannot, you may be missing the database credentials. Please reach out to mark@markdrecoll.com for access.</h3>"
        );
});

app.post("/saveMovie", async (request, response) => {
    try {
        const movie = new Movie(request.body);
        let result = await movie.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            response.send(request.body);
            console.log(result);
        } else {
            console.log("Cannot save movie.");
        }

    } catch (e) {
        response.send("An error has occured.");
    }
});

app.get("/retrieveMovies", async (request, response) => {
    Movie.find({}).then(function (movies){
        console.log("Below is a list of movies saved in the database.")
        console.log(movies);
        response.send(movies);
    })
});

app.listen(5000);