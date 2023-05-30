import { useEffect, useState } from "react";
import "./App.css";
import Movie from "../Movie/Movie";
import PopUp from "../PopUp/PopUp";
import SortingOptions from "../SortingOptions/SortingOptions";
function App() {
  const API_URL = "http://localhost:5000/movies";
  const API_SEARCH = "http://localhost:5000/movies/search?text=";

  const [movies, setMovies] = useState([]);
  const [ending, setEnding] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sortType, setSortType] = useState("alphabetical");
  const [defaultEnter, setDefaultEnter] = useState(null);
  const [results, setResults] = useState("");
  const [fakeEnding, setfakeEnding] = useState("");

  function renderMovies() {
    let sortedMovies = movies;

    if (sortType === "alphabetical") {
      sortedMovies = sortedMovies.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (sortType === "rating") {
      sortedMovies = sortedMovies.sort(
        (a, b) => b.vote_average - a.vote_average
      );
    } else if (sortType === "date-older") {
      sortedMovies = sortedMovies.sort((a, b) =>
        a.release_date.localeCompare(b.release_date)
      );
    } else if (sortType === "date-newer") {
      sortedMovies = sortedMovies.sort((a, b) =>
        b.release_date.localeCompare(a.release_date)
      );
    }

    return sortedMovies.map((movie) => (
      <Movie
        key={movie.id}
        onClick={() => handleMovieClick(movie)}
        {...movie}
      ></Movie>
    ));
  }
  const handleSearch = (e) => {
    e.preventDefault();
    fetch(API_SEARCH + ending)
      .then((res) => res.json())
      .then((data) => setMovies(data));
    setDefaultEnter(false);
    setfakeEnding("");
    setResults(ending);
  };
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
      });
    setDefaultEnter(true);
  }, []);

  const goHome = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMovies(data));
    setDefaultEnter(true);
  };

  const handleInputChange = (event) => {
    setEnding(() => {
      return event.target.value;
    });
  };
  useEffect(() => {
    setfakeEnding(() => ending);
  }, [ending]);

  return (
    <div className="App">
      <div className="search_nav">
        <div onClick={() => goHome()} className="title">
          <h1>Movies</h1>
        </div>
        <div className="search_box">
          <form onSubmit={handleSearch}>
            <input
              value={fakeEnding}
              placeholder="Enter movie name"
              onChange={handleInputChange}
            />
            <button>Search</button>
          </form>
        </div>
      </div>

      <div className="sorting">
        <SortingOptions handleSortChange={setSortType} />
      </div>
      <div>
        <div className="results">
          {!defaultEnter ? <h2>Results for: {results}</h2> : <></>}
        </div>
        {movies.length > 0 ? (
          <div className="movies">
            {renderMovies()}
            {selectedMovie && (
              <PopUp {...selectedMovie} onClose={setSelectedMovie} />
            )}
          </div>
        ) : (
          <div className="no-film">Sorry, there is no such a film</div>
        )}
      </div>
    </div>
  );
}

export default App;
