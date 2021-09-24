const MINUTES_IN_HOUR = 60;
const SHORT_DESCRIPTION_LENGTH = 140;
const FILMS_STEP_NUMBER = 5;
const FILMS_EXTRA_NUMBER = 2;
const FILMS_TOP_RATED_TITLE = 'Top rated';
const FILMS_MOST_COMMENTED_TITLE = 'Most commented';
const FILM_CARD_CONTROLS_ACTIVE_CLASS = 'film-card__controls-item--active ';
const FILM_DETAILS_CONTROLS_ACTIVE_CLASS = 'film-details__control-button--active ';
const UserRating = {
  NOVICE: 0,
  FAN: 10,
  MOVIE_BUFF: 20,
};
const UserRatingType = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};
const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};
const UserAction = {
  UPDATE_FILM_CARD: 'UPDATE_FILM_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};
const NavigationItem = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};
const StatisticsRange = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};
const AUTHORIZATION = 'Basic ax5ba248ZALUBe5';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const SHOW_TIME = 5000;

export { MINUTES_IN_HOUR, SHORT_DESCRIPTION_LENGTH, FILMS_STEP_NUMBER, FILMS_EXTRA_NUMBER, FILMS_TOP_RATED_TITLE, FILMS_MOST_COMMENTED_TITLE, FILM_CARD_CONTROLS_ACTIVE_CLASS, FILM_DETAILS_CONTROLS_ACTIVE_CLASS, UserRating, UserRatingType, SortType, UserAction, UpdateType, FilterType, NavigationItem, StatisticsRange, AUTHORIZATION, END_POINT, STORE_NAME, SHOW_TIME };
