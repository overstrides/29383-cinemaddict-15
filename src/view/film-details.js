import SmartView from './smart.js';
import he from 'he';
import { humanizeDate, humanizeCommentDate, getFilmDuration, checkIfActive } from '../utils/film.js';
import { FILM_DETAILS_CONTROLS_ACTIVE_CLASS } from '../const.js';

const createFilmDetailsTemplate = (filmDetailsCard, filmComments) => {

  const { title, alternativeTitle, totalRating, poster, ageRating, directors, writers, actors, release, runtime, genres, description, isInWatchlist, isWatched, isInFavorite, commentEmotion, commentText, isDisabled } = filmDetailsCard;

  const filmRuntime = getFilmDuration(runtime);
  const commentImage = commentEmotion ? `<img src=${commentEmotion} alt=${commentEmotion} width="70" height="70">` : '';
  const commentMessage = commentText ? commentText : '';
  let filmGenresList = '';
  genres.slice().forEach((item) => {
    filmGenresList += `<span class="film-details__genre">${item}</span>`;
  });
  const filmGenresTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const releaseDate = humanizeDate(release.date, 'D MMMM YYYY');

  let filmCommentsList = '';
  filmComments.slice().forEach((item) => {
    const commentDate = humanizeCommentDate(item.date);

    filmCommentsList += `<li class="film-details__comment" id=${item.id}>
      <span class="film-details__comment-emoji">
        <img src=./images/emoji/${item.emotion}.png width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(item.text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
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
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmRuntime}</td>
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
            <div class="film-details__add-emoji-label">${commentImage}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${he.encode(commentMessage)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isDisabled ? 'disabled' : ''}>
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

export default class FilmDetails extends SmartView {
  constructor(filmDetailsData) {
    super();
    this._filmDetailsData = filmDetailsData;
    this._filmDetails = FilmDetails.parseFilmDetailsToData(this._filmDetailsData[0]);
    this._filmComments = this._filmDetailsData[1];
    this._closeHandler = this._closeHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._clickFavoritesHandler = this._clickFavoritesHandler.bind(this);
    this._emotionInputHandler = this._emotionInputHandler.bind(this);
    this._textCommentHandler = this._textCommentHandler.bind(this);
    this._enterKeyDownHandler = this._enterKeyDownHandler.bind(this);
    this._clickDeleteHandler = this._clickDeleteHandler.bind(this);
    this._scrollHandler = this._scrollHandler.bind(this);
    this._commentEmotion = this._filmDetails.commentEmotion;
    this._commentText = this._filmDetails.commentText;
    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._filmDetails, this._filmComments);
  }

  _closeHandler(evt) {
    evt.preventDefault();
    this._callback.closeFilmDetails();
  }

  _clickWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatchlist(this._scrollPosition);
  }

  _clickWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatched(this._scrollPosition);
  }

  _clickFavoritesHandler(evt) {
    evt.preventDefault();
    this._callback.clickFavorites(this._scrollPosition);
  }

  _scrollHandler(evt) {
    evt.preventDefault();
    this._scrollPosition = this.getElement().scrollTop;
  }

  _enterKeyDownHandler(evt) {
    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      if (this._commentText !== '' && this._commentEmotion !== '') {
        this._newFilmComment = {
          emotion: this._emojiName,
          text: this._commentText,
        };

        this._callback.addNewComment(this._scrollPosition, FilmDetails.parseDataToFilmDetails(this._filmDetails), this._newFilmComment);
      }
    } else if (evt.key === 'Enter') {
      evt.preventDefault();
      this.getElement().querySelector('.film-details__new-comment').addEventListener('keydown', this._enterKeyDownHandler);
    }
  }

  _clickDeleteHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();
    this._deleteComment = evt.target.closest('.film-details__comment');
    this._idDeleteComment = this._deleteComment.id;

    const index = this._filmDetails.commentsId.findIndex((commentId) => commentId.toString() === this._idDeleteComment.toString());

    if (index === -1) {
      throw new Error('Can\'t delete unexisting commentsId');
    }

    this._callback.deleteComment(this._scrollPosition, FilmDetails.parseDataToFilmDetails(this._filmDetails), this._idDeleteComment);
  }

  setCloseFilmDetails(callback) {
    this._callback.closeFilmDetails = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeHandler);
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

  setScrollPosition(position) {
    this.getElement().scroll(0, position);
  }

  setNewCommentHandler(callback) {
    this._callback.addNewComment = callback;
    this.getElement().querySelector('.film-details__new-comment').addEventListener('keydown', this._enterKeyDownHandler);
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteComment = callback;
    this._commentList = this.getElement().querySelectorAll('.film-details__comment');
    this._commentList.forEach((comment) => {
      comment.addEventListener('click', this._clickDeleteHandler);
    });
  }

  setDetetingCommentHandler() {
    let deleteButtonElement = null;

    if (this._deleteComment) {
      deleteButtonElement = this._deleteComment.querySelector('.film-details__comment-delete');
    }

    if (deleteButtonElement) {
      deleteButtonElement.textContent = 'Deleting';
      deleteButtonElement.disabled = true;
    }
  }

  setAddingCommentHandler() {
    const addingCommentElement = this.getElement().querySelector('.film-details__new-comment');
    addingCommentElement.classList.add('film-details__new-comment--disabled');
  }

  setAbortingDeletingComment() {
    const deleteButtonElement = this._deleteComment.querySelector('.film-details__comment-delete');

    if (deleteButtonElement) {
      this._deleteComment.classList.add('shake');
      deleteButtonElement.textContent = 'Delete';
      deleteButtonElement.disabled = false;
    }
  }

  setAbortingAddingComment() {
    this.updateData({
      commentEmotion: this._commentEmotion,
      commentText: this._commentText,
    });
    const addingCommentElement = this.getElement().querySelector('.film-details__new-comment');
    const textCommentElement = this.getElement().querySelector('.film-details__comment-input');
    textCommentElement.disabled = false;
    addingCommentElement.classList.add('shake');
    addingCommentElement.classList.remove('film-details__new-comment--disabled');
  }

  _emotionInputHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'IMG') {
      return;
    }

    const addCommentFormElement = this.getElement().querySelector('.film-details__new-comment');

    if (!addCommentFormElement.classList.contains('film-details__new-comment--disabled')) {
      const emojiLabel = evt.target.parentElement.htmlFor;
      const emojiInputId = `#${emojiLabel}`;
      const emojiInputElement = this.getElement().querySelector(emojiInputId);
      this._emojiName = emojiInputElement.value;
      this._commentEmotion = `./images/emoji/${this._emojiName}.png`;

      this.updateData({
        commentEmotion: this._commentEmotion,
      });
    }

    this.setScrollPosition(this._scrollPosition);
  }

  _textCommentHandler(evt) {
    evt.preventDefault();
    this._commentText = evt.target.value;

    this.updateData({
      commentText: this._commentText,
    }, true);
  }

  getFilmDetailsData() {
    return this._filmDetails;
  }

  getFilmDetails() {
    return FilmDetails.parseDataToFilmDetails(this._filmDetails);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  reset(film) {
    this._filmDetailsData = [];
    this._filmDetailsData.push(FilmDetails.parseDataToFilmDetails(film));
    this._filmDetailsData.push(this._filmComments);
    this.updateData(
      this._filmDetails,
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._clickWatchlistHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._clickWatchedHandler);
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._clickFavoritesHandler);
    this.getElement().addEventListener('scroll', this._scrollHandler);
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emotionInputHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._textCommentHandler);
    this.getElement()
      .querySelector('.film-details__new-comment')
      .addEventListener('keydown', this._enterKeyDownHandler);
    this._commentList = this.getElement().querySelectorAll('.film-details__comment');
    this._commentList.forEach((comment) => {
      comment.addEventListener('click', this._clickDeleteHandler);
    });
  }

  static parseFilmDetailsToData(film) {
    let filmDetails = film;

    filmDetails = Object.assign(
      {},
      filmDetails,
      {
        commentEmotion: filmDetails.commentEmotion ? filmDetails.commentEmotion : '',
        commentText: filmDetails.commentText ? filmDetails.commentText : '',
      },
    );

    return filmDetails;
  }

  static parseDataToFilmDetails(film) {
    const filmDetails = film;

    delete filmDetails.commentEmotion;
    delete filmDetails.commentText;

    return filmDetails;
  }
}
