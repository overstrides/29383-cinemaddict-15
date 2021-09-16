import { FilterType } from '../const';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.slice().filter((film) => film.isInWatchlist),
  [FilterType.HISTORY]: (films) => films.slice().filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.slice().filter((film) => film.isInFavorite),
};

export { filter };
