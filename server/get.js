const fs = require("fs");
const API = "083a5c1923ab61d3a2a96c12dfe2626f";
const totalPages = 10;
const moviesPerPage = 20;
const totalMovies = totalPages * moviesPerPage;
const moviePromises = [];

for (let page = 1; page <= totalPages; page++) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API}&language=en-US&page=${page}`;
  moviePromises.push(
    fetch(url)
      .then((response) => response.json())
      .then((data) => data.results)
  );
}

Promise.all(moviePromises)
  .then((movieDataArray) => {
    const movies = movieDataArray.flat().slice(0, totalMovies);
    const movieDetailsPromises = movies.map((movie) =>
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API}&append_to_response=credits,videos`
      ).then((response) => response.json())
    );

    return Promise.all(movieDetailsPromises);
  })
  .then((movieDetailsArray) => {
    const processedMovies = movieDetailsArray.map((movie) => {
      if (!movie) {
        console.log("Empty movie found.");
        return null;
      }

      const {
        title,
        vote_average,
        overview,
        poster_path,
        release_date,
        credits,
        videos,
      } = movie;
      const director = credits?.crew?.find(
        (person) => person.job === "Director"
      )?.name;
      const actors = credits?.cast?.slice(0, 3)?.map((person) => person.name);
      const trailer = videos?.results?.find(
        (video) => video.type === "Trailer"
      );

      return {
        title,
        vote_average,
        overview,
        poster_path,
        release_date,
        director,
        actors,
        trailer_link: trailer
          ? `https://www.youtube.com/embed/${trailer.key}`
          : "",
      };
    });

    const validMovies = processedMovies.filter((movie) => movie !== null);

    const jsonData = JSON.stringify(validMovies);
    fs.writeFile("movie_data.json", jsonData, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Movie data saved to file.");
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching movie data:", error);
  });
