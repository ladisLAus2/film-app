import React from "react";

import "./Movie.css";

const Movie = (props) => {
  const API_IMG = "https://image.tmdb.org/t/p/w500/";
  return (
    <div data-testid={props.id} onClick={props.onClick} className="card">
      <div className="poster">
        <img
          src={
            props.poster_path
              ? API_IMG + props.poster_path
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/J._M._Flagg%2C_I_Want_You_for_U.S._Army_poster_%281917%29.jpg/1200px-J._M._Flagg%2C_I_Want_You_for_U.S._Army_poster_%281917%29.jpg"
          }
          alt=""
        />
      </div>
      <div className="info">
        <p className="title">{props.title}</p>
        <p className="rating">{props.vote_average}</p>
      </div>
      <div className="overview">
        <button className="info-overview">See Details</button>
      </div>
    </div>
  );
};

export default Movie;
