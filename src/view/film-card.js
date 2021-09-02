import AbstractView from './abstract.js';
import { truncateDescription, humanizeDate, checkIfActive } from '../utils/film.js';
import { FILM_CARD_CONTROLS_ACTIVE_CLASS, SHORT_DESCRIPTION_LENGTH } from '../const.js';

const createFilmCardTemplate = (filmCard = {}) => {
  const { title, totalRating, poster, release, runtime, genres, description, userDetails, commentsId } = filmCard;

  const releaseYear = humanizeDate(release.date, 'YYYY');
  const truncatedDescription = truncateDescription(description, SHORT_DESCRIPTION_LENGTH);

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${truncatedDescription}</p>
    <a class="film-card__comments">${commentsId.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${checkIfActive(userDetails.isInWatchlist, FILM_CARD_CONTROLS_ACTIVE_CLASS)}film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${checkIfActive(userDetails.isWatched, FILM_CARD_CONTROLS_ACTIVE_CLASS)}film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${checkIfActive(userDetails.isInFavorite, FILM_CARD_CONTROLS_ACTIVE_CLASS)}film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._openHandler = this._openHandler.bind(this);
  }

  _openHandler(evt) {
    evt.preventDefault();
    this._callback.openFilmDetails();
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  setOpenFilmDetails(callback) {
    this._callback.openFilmDetails = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openHandler);
  }
}
