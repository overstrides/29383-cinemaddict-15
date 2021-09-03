import AbstractView from './abstract.js';
import { checkIfActive } from '../utils/film.js';
import { FILM_DETAILS_CONTROLS_ACTIVE_CLASS } from '../const.js';

const createFilmDetailsTemplate = (filmDetailsData) => {
  const [filmDetailsCard, filmComments] = [filmDetailsData[0], filmDetailsData[1]];

  const { title, alternativeTitle, totalRating, poster, ageRating, directors, writers, actors, release, runtime, genres, description, isInWatchlist, isWatched, isInFavorite } = filmDetailsCard;

  let filmGenresList = '';
  genres.slice().forEach((item) => {
    filmGenresList += `<span class="film-details__genre">${item}</span>`;
  });
  const filmGenresTitle = genres.length > 1 ? 'Genres' : 'Genre';

  let filmCommentsList = '';
  filmComments.slice().forEach((item) => {
    filmCommentsList += `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src=${item.emotion} width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${item.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${item.date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  });

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${poster} alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${directors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${release.date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${filmGenresTitle}</td>
                <td class="film-details__cell">${filmGenresList}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${checkIfActive(isInWatchlist, FILM_DETAILS_CONTROLS_ACTIVE_CLASS)}film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${checkIfActive(isWatched, FILM_DETAILS_CONTROLS_ACTIVE_CLASS)}film-details__control-button--watched" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${checkIfActive(isInFavorite, FILM_DETAILS_CONTROLS_ACTIVE_CLASS)}film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${filmCommentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetails extends AbstractView {
  constructor(filmDetailsData) {
    super();
    this._filmDetailsData = filmDetailsData;
    this._closeHandler = this._closeHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._clickFavoritesHandler = this._clickFavoritesHandler.bind(this);
  }

  _closeHandler(evt) {
    evt.preventDefault();
    this._callback.closeFilmDetails();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._filmDetailsData);
  }

  setCloseFilmDetails(callback) {
    this._callback.closeFilmDetails = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeHandler);
  }

  _clickWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatchlist();
  }

  _clickWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatched();
  }

  _clickFavoritesHandler(evt) {
    evt.preventDefault();
    this._callback.clickFavorites();
  }

  setWatchlistClickHandler(callback) {
    this._callback.clickWatchlist = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._clickWatchlistHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.clickWatched = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._clickWatchedHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.clickFavorites = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._clickFavoritesHandler);
  }
}
