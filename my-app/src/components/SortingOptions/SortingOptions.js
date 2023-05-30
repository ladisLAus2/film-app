import React from "react";
import "./SortingOptions.css";
export default function SortingOptions(props) {
  const handleSortChange = (event) => {
    props.handleSortChange(event.target.value);
  };
  return (
    <div>
      <label className="label" htmlFor="sort-select">
        Sort By:
      </label>
      <select
        data-testid="sorting"
        onChange={handleSortChange}
        aria-label="Sort By"
      >
        <option value="alphabetical">Alphabetical</option>
        <option value="rating">Rating</option>
        <option value="date-older">Date older</option>
        <option value="date-newer">Date newer</option>
      </select>
    </div>
  );
}
