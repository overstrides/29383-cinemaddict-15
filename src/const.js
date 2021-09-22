const MIN_STRINGS_DESCRIPTION = 1;
const MAX_STRINGS_DESCRIPTION = 5;
const MIN_FILM_RATING = 1;
const MAX_FILM_RATING = 10;
const MINUTES_IN_HOUR = 60;
const TEXT_SOURCE = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];
const SHORT_DESCRIPTION_LENGTH = 140;
const FILM_WATCH_MAX_RANGE = 365;
const COMMENTS_EMOTIONS = ['angry.png', 'puke.png', 'sleeping.png', 'smile.png'];
const COMMENTS_DATE_MAX_RANGE = 30;
const COMMENTS_AUTHORS = ['Evie Flakes', 'Horace Barcus', 'Armando Schiele', 'Tierra Waid', 'Jacklyn Troxel', 'Bobby Pechacek', 'Polly Reeder', 'Sha Sebastian', 'Katherina Labree', 'Don Moeckel'];
const MIN_STRINGS_COMMENT = 1;
const MAX_STRINGS_COMMENT = 2;
const MIN_COMMENTS_NUMBER = 0;
const MAX_COMMENTS_NUMBER = 5;
const FILMS_NUMBER = 20;
const FILMS_STEP_NUMBER = 5;
const FILMS_EXTRA_NUMBER = 2;
const FILMS_TOP_RATED_TITLE = 'Top rated';
const FILMS_MOST_COMMENTED_TITLE = 'Most commented';
const FILM_CARD_CONTROLS_ACTIVE_CLASS = 'film-card__controls-item--active ';
const FILM_DETAILS_CONTROLS_ACTIVE_CLASS = 'film-details__control-button--active ';
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

export { MIN_STRINGS_DESCRIPTION, MAX_STRINGS_DESCRIPTION, MIN_FILM_RATING, MAX_FILM_RATING, MINUTES_IN_HOUR, TEXT_SOURCE, SHORT_DESCRIPTION_LENGTH, FILM_WATCH_MAX_RANGE, COMMENTS_EMOTIONS, COMMENTS_DATE_MAX_RANGE, COMMENTS_AUTHORS, MIN_STRINGS_COMMENT, MAX_STRINGS_COMMENT, MIN_COMMENTS_NUMBER, MAX_COMMENTS_NUMBER, FILMS_NUMBER, FILMS_STEP_NUMBER, FILMS_EXTRA_NUMBER, FILMS_TOP_RATED_TITLE, FILMS_MOST_COMMENTED_TITLE, FILM_CARD_CONTROLS_ACTIVE_CLASS, FILM_DETAILS_CONTROLS_ACTIVE_CLASS, SortType, UserAction, UpdateType, FilterType, NavigationItem, StatisticsRange, AUTHORIZATION, END_POINT };
