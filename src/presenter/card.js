import dayjs from 'dayjs';
import { UserAction, UpdateType, FilterType } from '../const.js';
import { render, replace, remove } from '../utils/render.js';
import { getFilmDetailsData } from '../utils/film.js';
import Abstract from '../view/abstract.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Card {
  constructor(filmDetailsContainer, filmsComments, changeData, changeMode, updateComments, updateFilteredFilmList, openCard, closeCard) {
    this._filmDetailsContainer = filmDetailsContainer;
    this._filmsComments = filmsComments;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._updateComments = updateComments;
    this._updateFilteredFilmList = updateFilteredFilmList;
    this._openCard = openCard;
    this._closeCard = closeCard;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._clickOpenFilmDetails = this._clickOpenFilmDetails.bind(this);
    this._clickCloseFilmDetails = this._clickCloseFilmDetails.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._handleAddedComment = this._handleAddedComment.bind(this);
    this._handleDeletedComment = this._handleDeletedComment.bind(this);
  }

  init(filmContainer, filmCard, filmsComments = this._filmsComments) {
    this._filmContainer = filmContainer;
    this._filmCard = filmCard;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardView(this._filmCard);
    this._filmDetailsCard = getFilmDetailsData(this._filmCard, filmsComments);
    this._filmDetailsComponent = new FilmDetailsView(this._filmDetailsCard);

    this._filmCardComponent.setOpenFilmDetails(this._clickOpenFilmDetails);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._filmDetailsComponent.setCloseFilmDetails(this._clickCloseFilmDetails);
    this._filmDetailsComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmDetailsComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._filmDetailsComponent.setNewCommentHandler(this._handleAddedComment);
    this._filmDetailsComponent.setDeleteCommentHandler(this._handleDeletedComment);

    if (prevFilmCardComponent === null || prevFilmDetailsComponent === null) {
      render(this._filmContainer, this._filmCardComponent);
      return;
    }

    if (this._filmContainer instanceof Abstract) {
      this._filmContainer = this._filmContainer.getElement();
    }

    if (this._filmDetailsContainer instanceof Abstract) {
      this._filmDetailsContainer = this._filmDetailsContainer.getElement();
    }

    if (this._filmContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._filmDetailsContainer.contains(prevFilmDetailsComponent.getElement())) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._clickCloseFilmDetails();
    }
  }

  setActionAddingComment() {
    this._filmDetailsComponent.updateData({
      isDisabled: true,
    });
    this._filmDetailsComponent.setAddingCommentHandler();
  }

  setActionDeletingComment() {
    this._filmDetailsComponent.setDetetingCommentHandler();
  }

  setCancelActionAddingComment() {
    this._filmDetailsComponent.setAbortingAddingComment();
  }

  setCancelActionDeletingComment() {
    this._filmDetailsComponent.setAbortingDeletingComment();
  }

  setFilmDetailsScrollPosition(scrollPosition = 0) {
    if (this._mode === 'EDITING') {
      this._filmDetailsComponent.setScrollPosition(scrollPosition);
    }
  }

  _clickOpenFilmDetails() {
    this._openFilmDetails();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _clickCloseFilmDetails() {
    this._closeFilmDetails();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _openFilmDetails() {
    this._openCard();
    this._filmDetailsContainer.appendChild(this._filmDetailsComponent.getElement());
    this._filmDetailsContainer.classList.add('hide-overflow');
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _closeFilmDetails() {
    this._closeCard();
    this._filmCard = this._filmDetailsComponent.getFilmDetails();
    this._filmDetailsComponent.reset(this._filmDetailsCard);
    this._filmDetailsContainer.removeChild(this._filmDetailsComponent.getElement());
    this._filmDetailsContainer.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    this._updateComments();
    this._updateFilteredFilmList();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmDetails();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleWatchlistClick(position = null) {
    if (this._mode === Mode.EDITING) {
      this._filmCard = this._filmDetailsComponent.getFilmDetailsData();
    }
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._filmCard,
        {
          isInWatchlist: !this._filmCard.isInWatchlist,
        },
      ),
      null,
      this._mode,
      FilterType.WATCHLIST,
      position,
    );
    if (position !== null) {
      this._filmDetailsComponent.setScrollPosition(position);
    }
  }

  _handleHistoryClick(position = null) {
    if (this._mode === Mode.EDITING) {
      this._filmCard = this._filmDetailsComponent.getFilmDetailsData();
    }
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._filmCard,
        {
          isWatched: !this._filmCard.isWatched,
          watchingDate: this._filmCard.isWatched === false ? dayjs().toDate() : '',
        },
      ),
      null,
      this._mode,
      FilterType.HISTORY,
      position,
    );
    if (position !== null) {
      this._filmDetailsComponent.setScrollPosition(position);
    }
  }

  _handleFavoritesClick(position = null) {
    if (this._mode === Mode.EDITING) {
      this._filmCard = this._filmDetailsComponent.getFilmDetailsData();
    }
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._filmCard,
        {
          isInFavorite: !this._filmCard.isInFavorite,
        },
      ),
      null,
      this._mode,
      FilterType.FAVORITES,
      position,
    );
    if (position !== null) {
      this._filmDetailsComponent.setScrollPosition(position);
    }
  }

  _handleAddedComment(position = null, film, comment) {
    if (this._mode === Mode.EDITING) {
      this._filmCard = this._filmDetailsComponent.getFilmDetailsData();
    }
    this._changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, film, comment, this._mode, FilterType.ALL, position);
    if (position !== null) {
      this._filmDetailsComponent.setScrollPosition(position);
    }
  }

  _handleDeletedComment(position = null, film, comment) {
    if (this._mode === Mode.EDITING) {
      this._filmCard = this._filmDetailsComponent.getFilmDetailsData();
    }
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.MINOR, film, comment, this._mode, FilterType.ALL, position);
    if (position !== null) {
      this._filmDetailsComponent.setScrollPosition(position);
    }
  }
}
