import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Movie from "./components/Movie/Movie";
import SortingOptions from "./components/SortingOptions/SortingOptions";
import PopUp from "./components/PopUp/PopUp";

describe("Movie component", () => {
  const mockMovie = {
    id: 1,
    title: "Test",
    poster_path: "/test-poster.jpg",
    vote_average: 7.5,
  };

  it("renders movie details", () => {
    const container = render(<Movie key={mockMovie.id} {...mockMovie} />);
    expect(container.getByText(mockMovie.title)).toBeInTheDocument();
    expect(container.getByText(mockMovie.vote_average)).toBeInTheDocument();
  });
  it("calls setSelectedMovie when clicked", () => {
    const mockSetSelectedMovie = jest.fn();
    const container = render(
      <Movie
        onClick={() => mockSetSelectedMovie(mockMovie)}
        key={mockMovie.id}
        {...mockMovie}
      />
    );
    fireEvent.click(container.getByTestId(mockMovie.id));
    expect(mockSetSelectedMovie).toHaveBeenCalledWith(mockMovie);
  });
});

describe("SortingOptions component", () => {
  it("renders select element", () => {
    const mockSetSortingOption = jest.fn();
    const { getByLabelText } = render(
      <SortingOptions handleSortChange={mockSetSortingOption} />
    );
    const selectElement = getByLabelText("Sort By");
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.value).toBe("alphabetical");
  });
  it("calls setSortingOption when option selected", () => {
    const mockSetSortingOption = jest.fn();
    const { getByLabelText, getByTestId } = render(
      <SortingOptions handleSortChange={mockSetSortingOption} />
    );
    fireEvent.change(getByTestId("sorting"), {
      target: { value: "rating" },
    });
    expect(mockSetSortingOption).toHaveBeenCalledWith("rating");
  });
});

describe("PopUp component", () => {
  const mockMovie = {
    id: "6474514edf04a0c6a10d315a",
    title: "Avatar",
    vote_average: 7.569,
    overview:
      "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    trailer_link: "https://www.youtube.com/embed/jm2sNLIPPvA",
    director: "James Cameron",
    actors: ["Sam Worthington", "Zoe Saldaña", "Stephen Lang"],
  };

  test("renders popup with movie details", async () => {
    const createPortalMock = jest.spyOn(require("react-dom"), "createPortal");
    createPortalMock.mockImplementation((children, container) => {
      return children;
    });

    const mockSetSelectedMovie = jest.fn();
    const { getByText, getByTitle } = render(
      <PopUp {...mockMovie} setSelectedMovie={mockSetSelectedMovie} />
    );

    expect(getByText(mockMovie.title)).toBeInTheDocument();
    await waitFor(() => {
      expect(getByText(mockMovie.overview)).toBeInTheDocument();
      expect(getByText(mockMovie.vote_average)).toBeInTheDocument();
      expect(getByText(mockMovie.director)).toBeInTheDocument();
      expect(getByTitle(mockMovie.title)).toHaveAttribute(
        "src",
        mockMovie.trailer_link
      );
    });

    createPortalMock.mockRestore();
  });
  test("renders popup with movie details", () => {
    const createPortalMock = jest.spyOn(require("react-dom"), "createPortal");
    createPortalMock.mockImplementation((children) => {
      return children;
    });

    const mockSetSelectedMovie = jest.fn();
    const { getByText, getByTestId } = render(
      <PopUp {...mockMovie} onClose={mockSetSelectedMovie} />
    );
    fireEvent.click(getByTestId("close"));
    expect(mockSetSelectedMovie).toHaveBeenCalledWith(null);
    createPortalMock.mockRestore();
  });
});
