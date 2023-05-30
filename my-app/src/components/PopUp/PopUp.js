import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";
import "./popup.css";
function PopUp(props) {
  const popupRef = useRef(null);

  const [trailerUrl, setTrailerUrl] = useState("");
  const [director, setDirector] = useState("");
  const [actors, setActors] = useState([]);
  const [rating, setRating] = useState("");
  const [overview, setOverview] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setTrailerUrl(props.trailer_link);
    setDirector(props.director);
    setActors(props.actors);
    setDate(props.release_date);
    setRating(props.vote_average);
    setOverview(props.overview);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleClose = () => {
    props.onClose(null);
  };

  return ReactDOM.createPortal(
    <div className="wrap">
      <div className="container">
        <div className="someclass">
          <button
            data-testid="close"
            className="closeBtn"
            onClick={handleClose}
          >
            X
          </button>
        </div>
        <div className="flex">
          <div className="details" ref={popupRef}>
            <div className="name">
              <h2>{props.title}</h2>
            </div>
            <div className="row">
              <strong>Director:</strong> <span>{director}</span>
            </div>
            <hr />
            <div className="row">
              <strong>Main actors: </strong>

              {actors.map((actor) => (
                <span key={actor}>{actor}</span>
              ))}
            </div>
            <hr />
            <div className="row">
              <strong>Rating: </strong>
              {rating}
            </div>
            <div className="row">
              <strong>Date: </strong>
              {date}
            </div>
          </div>
          <div className="trailer">
            <iframe
              title={props.title}
              width="560"
              height="315"
              src={trailerUrl}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="over">
          <h2>Overview</h2>
          <p>{overview}</p>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default PopUp;
