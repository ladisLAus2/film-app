const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
app.use(cors());
const movieSchema = new mongoose.Schema({
  title: String,
  vote_average: Number,
  overview: String,
  poster_path: String,
  release_date: String,
  director: String,
  actors: [String],
  trailer_link: String,
});

const Movie = mongoose.model("Movie", movieSchema);

app.use(express.json());
app.use("/", express.static("../my-app/build"));

app.get("/movies", (req, res) => {
  Movie.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error("Error finding movies:", error);
      res.status(500).send("Error");
    });
});

app.get("/movies/search", (req, res) => {
  const searchText = req.query.text;
  Movie.find({ title: { $regex: searchText, $options: "i" } })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error("Error retrieving movies:", error);
      res.status(500).send("Error");
    });
});

app.post("/post", (req, res) => {
  fs.readFile("movie_data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error");
      return;
    }

    const movieData = JSON.parse(data);

    Movie.insertMany(movieData)
      .then(() => {
        console.log("Movie data inserted to database");
        res.status(201).send("Movie data inserted");
      })
      .catch((error) => {
        console.error("Error inserting movie data:", error);
        res.status(500).send("Error");
      });
  });
});

mongoose
  .connect(
    "mongodb+srv://admin:0977202131@movie-api.adm9suu.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to database");
    app.listen(5000, () => {
      console.log("server listens port 5000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        res.status(404).send("Movie not found");
      } else {
        res.status(200).json(movie);
      }
    })
    .catch((error) => {
      console.error("Error retrieving movie:", error);
      res.status(500).send("Error");
    });
});

app.post("/movies", (req, res) => {
  const movie = new Movie(req.body);
  movie
    .save()
    .then(() => {
      res.status(201).send("Movie created successfully");
    })
    .catch((error) => {
      console.error("Error creating movie:", error);
      res.status(500).send("Error");
    });
});

app.put("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const updateData = req.body;
  Movie.findByIdAndUpdate(movieId, updateData, { new: true })
    .then((movie) => {
      if (!movie) {
        res.status(404).send("Movie not found");
      } else {
        res.status(200).json(movie);
      }
    })
    .catch((error) => {
      console.error("Error updating movie:", error);
      res.status(500).send("Error");
    });
});

app.delete("/movies/:id", (req, res) => {
  const movieId = req.params.id;
  Movie.findByIdAndDelete(movieId)
    .then((movie) => {
      if (!movie) {
        res.status(404).send("Movie not found");
      } else {
        res.status(200).send("Movie deleted successfully");
      }
    })
    .catch((error) => {
      console.error("Error deleting movie:", error);
      res.status(500).send("Error");
    });
});
