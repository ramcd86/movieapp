addEventListener("message", ({ data }) => {
  const { movies, sortBy } = data;
  switch (sortBy) {
    case "rating":
      movies.sort(
        (a, b) => parseFloat(b.getImdbRating()) - parseFloat(a.getImdbRating())
      );
      break;
    case "year":
      movies.sort(
        (a, b) => parseInt(b.getYear(), 10) - parseInt(a.getYear(), 10)
      );
      break;
    case "alphabetically":
      movies.sort((a, b) => {
        const titleA = a.getTitle()?.toUpperCase() ?? "";
        const titleB = b.getTitle()?.toUpperCase() ?? "";
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
      break;
    default:
      break;
  }
  postMessage(movies);
});
