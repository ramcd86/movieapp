addEventListener('message', ({ data }) => {
  const { movies, sortBy, rateDir, yearDir, alphaDir } = data;
  switch (sortBy) {
    case 'rating':
      movies.sort(
        (a: any, b: any) =>
          Math.floor(parseFloat(b.imdbRating)) -
          Math.floor(parseFloat(a.imdbRating))
      );
      if (rateDir === 'desc') {
        movies.reverse();
      }
      break;
    case 'year':
      movies.sort(
        (a: any, b: any) => parseInt(b.year, 10) - parseInt(a.year, 10)
      );
      if (yearDir === 'desc') {
        movies.reverse();
      }
      break;
    case 'alphabetically':
      movies.sort((a: any, b: any) => {
        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
      if (alphaDir === 'desc') {
        movies.reverse();
      }
      break;
    default:
      break;
  }

  postMessage(movies);
});
