import { FILMS_STEP_NUMBER, FILMS_EXTRA_NUMBER, FILMS_TOP_RATED_TITLE, FILMS_MOST_COMMENTED_TITLE, SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { RenderPosition, render, remove } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';
import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainerView from '../view/films-list-container.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreView from '../view/show-more.js';
import NoFilmCardsView from '../view/no-film-cards.js';
import CardPresenter from './card.js';

export default class Board {
  constructor(boardContainer, filmsModel, filterModel) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._siteMainElement = boardContainer.querySelector('.main');
    this._renderedFilmsCardCount = FILMS_STEP_NUMBER;
    this._filmCardsPresenter = new Map();
    this._filmCardsTopRatedPresenter = new Map();
    this._filmCardsMostCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._isCommentUpdated = false;
    this._filterType = FilterType.ALL;
    this._filterFilmChange = '';
    this._sortComponent = null;
    this._showMoreComponent = null;
    this._noFilmCardsComponent = null;
    this._filmsListContainerComponent = null;
    this._mode = 'DEFAULT';

    this._filmsComponent = new FilmsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._updateMostCommentedComponent = this._updateMostCommentedComponent.bind(this);
    this._updateFilteredFilmList = this._updateFilteredFilmList.bind(this);
  }

  init() {
    const films = this._filmsModel.getFilms().slice();
    const filtredFilms = filter[this._filterType](films);
    this._filmCardsOnPage = Math.min(filtredFilms.length, FILMS_STEP_NUMBER);
    this._isNotEmpty = Boolean(filtredFilms.length);

    this._filmsListComponent = new FilmsListView();

    render(this._siteMainElement, this._filmsComponent);
    render(this._filmsComponent, this._filmsListComponent);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearFilmList({resetRenderedCardCount: true, resetSortType: true});

    remove(this._filmsComponent);
    remove(this._filmsListContainerComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms().slice();
    const filtredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortByRating);
    }

    return filtredFilms;
  }

  _getFilmsNoFiltered() {
    return this._filmsModel.getFilms().slice();
  }

  _getComments() {
    return this._filmsModel.getComments();
  }

  _handleViewAction(actionType, updateType, updateFilmCard, updateComment, mode, filterType = FilterType.ALL) {
    this._mode = mode;
    this._filterFilmChange = filterType === 'watched' ? 'history' : filterType;
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._filmsModel.updateFilmCard(updateType, updateFilmCard, null, filterType);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.addComment(updateType, updateFilmCard, updateComment);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.deleteComment(updateType, updateFilmCard, updateComment);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    const comments = this._getComments();

    switch (updateType) {
      case UpdateType.PATCH:
        if (this._filterFilmChange === this._filterType) {
          this._filterFilmChange = '';
          if (this._mode === 'DEFAULT') {
            this._updateFilteredFilmList();
          }
        }
        if(this._filmCardsPresenter.has(data.id)) {
          this._filmCardsPresenter.get(data.id).init(this._filmsListContainerComponent, data, comments);
        }
        if(this._filmCardsTopRatedPresenter.has(data.id)) {
          this._filmCardsTopRatedPresenter.get(data.id).init(this._filmsTopRatedContainerElement, data, comments);
        }
        if(this._filmCardsMostCommentedPresenter.has(data.id)) {
          this._filmCardsMostCommentedPresenter.get(data.id).init(this._filmsMostCommentedContainerElement, data, comments);
        }
        break;
      case UpdateType.MINOR:
        this._isCommentUpdated = true;

        if(this._filmCardsPresenter.has(data.id)) {
          this._filmCardsPresenter.get(data.id).init(this._filmsListContainerComponent, data, comments);
        }
        if(this._filmCardsTopRatedPresenter.has(data.id)) {
          this._filmCardsTopRatedPresenter.get(data.id).init(this._filmsTopRatedContainerElement, data, comments);
        }
        if(this._filmCardsMostCommentedPresenter.has(data.id)) {
          this._filmCardsMostCommentedPresenter.get(data.id).init(this._filmsMostCommentedContainerElement, data, comments);
        }
        break;
      case UpdateType.MAJOR: {
        this._clearFilmList({resetRenderedCardCount: true, resetSortType: true});
        this._renderCardList();
      }
    }
  }

  _updateFilteredFilmList() {
    this._clearFilmList({resetRenderedCardCount: false, resetSortType: false});
    this._renderFilteredCardList();
  }

  _updateMostCommentedComponent() {
    if (this._isCommentUpdated) {
      this._clearMostCommentedList();
      this._getFilmsMostCommented();
    }
    this._isCommentUpdated = false;
  }

  _handleModeChange() {
    this._filmCardsPresenter.forEach((presenter) => presenter.resetView());
    this._filmCardsTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this._filmCardsMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList({resetRenderedCardCount: true});
    this._renderCardList();
  }

  _renderNoFilmCards() {
    this._noFilmCardsComponent = new NoFilmCardsView(this._filterType);
    render(this._filmsListComponent, this._noFilmCardsComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._filmsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCard(filmCardsContainer, filmCard) {
    const comments = this._getComments();
    const cardPresenter = new CardPresenter(this._boardContainer, comments, this._handleViewAction, this._handleModeChange, this._updateMostCommentedComponent, this._updateFilteredFilmList);
    cardPresenter.init(filmCardsContainer, filmCard);

    switch (filmCardsContainer) {
      case this._filmsListContainerComponent:
        this._filmCardsPresenter.set(filmCard.id, cardPresenter);
        break;
      case this._filmsTopRatedContainerElement:
        this._filmCardsTopRatedPresenter.set(filmCard.id, cardPresenter);
        break;
      case this._filmsMostCommentedContainerElement:
        this._filmCardsMostCommentedPresenter.set(filmCard.id, cardPresenter);
        break;
    }
  }

  _renderFilmCards(filmCards) {
    filmCards.forEach((filmCard) => this._renderFilmCard(this._filmsListContainerComponent, filmCard));
  }

  _renderCardList() {
    const filmCardCount = this._getFilms().length;

    if (filmCardCount === 0) {
      this._renderNoFilmCards();
      return;
    }
    this._renderSort();
    this._renderFilmsListContainer();

    const filmCards = this._getFilms().slice(0, Math.min(filmCardCount, FILMS_STEP_NUMBER));
    this._filmCardsOnPage = Math.min(filmCardCount, FILMS_STEP_NUMBER);

    this._renderFilmCards(filmCards);

    if (filmCardCount > FILMS_STEP_NUMBER) {
      this._renderShowMoreButton();
    }
  }

  _renderFilteredCardList() {
    const filmCardCount = this._getFilms().length;

    if (filmCardCount === 0) {
      this._renderNoFilmCards();
      return;
    }

    this._renderSort();
    this._renderFilmsListContainer();

    const filmCards = this._getFilms().slice(0, this._filmCardsOnPage);

    this._renderFilmCards(filmCards);

    if (filmCardCount > this._filmCardsOnPage) {
      this._renderShowMoreButton();
    }
  }

  _clearMostCommentedList() {
    this._filmCardsMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardsMostCommentedPresenter.clear();
  }

  _clearFilmList({resetRenderedCardCount = false, resetSortType = false} = {}) {
    const filmCardCount = this._getFilms().length;

    this._filmCardsPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardsPresenter.clear();

    remove(this._sortComponent);
    remove(this._filmsListContainerComponent);
    remove(this._showMoreComponent);

    if (this._noFilmCardsComponent) {
      remove(this._noFilmCardsComponent);
    }

    if (resetRenderedCardCount) {
      this._renderedFilmsCardCount = FILMS_STEP_NUMBER;
    } else {
      this._renderedFilmsCardCount = Math.min(filmCardCount, this._renderedFilmsCardCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleShowMoreButtonClick() {
    const filmCardCount = this._getFilms().length;
    const newRenderedFilmCardCount = Math.min(filmCardCount, this._renderedFilmsCardCount + FILMS_STEP_NUMBER);
    const filmCards = this._getFilms().slice(this._renderedFilmsCardCount, newRenderedFilmCardCount);

    this._renderFilmCards(filmCards);
    this._renderedFilmsCardCount = newRenderedFilmCardCount;
    this._filmCardsOnPage = this._renderedFilmsCardCount;

    if (this._renderedFilmsCardCount >= filmCardCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._showMoreComponent = new ShowMoreView();

    render(this._filmsListComponent, this._showMoreComponent);

    this._showMoreComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsTopRated() {
    render(this._filmsComponent, new FilmsListExtraView(FILMS_TOP_RATED_TITLE));
    const filmsTopRatedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[0];
    this._filmsTopRatedContainerElement = filmsTopRatedElement.querySelector('.films-list__container');

    this._sortedFilmsCardsByRating = this._getFilmsNoFiltered().slice().sort((a, b) => b.totalRating - a.totalRating);

    this._sortedFilmsCardsByRating
      .slice(0, Math.min(this._sortedFilmsCardsByRating.length, FILMS_EXTRA_NUMBER))
      .forEach((sortedCard) => {
        this._renderFilmCard(this._filmsTopRatedContainerElement, sortedCard);
      });
  }

  _getFilmsMostCommented() {
    this._sortedFilmsCardsByComments = this._getFilmsNoFiltered().slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

    this._sortedFilmsCardsByComments
      .slice(0, Math.min(this._sortedFilmsCardsByComments.length, FILMS_EXTRA_NUMBER))
      .forEach((sortedCard) => {
        this._renderFilmCard(this._filmsMostCommentedContainerElement, sortedCard);
      });
  }

  _renderfilmsMostCommented() {
    render(this._filmsComponent, new FilmsListExtraView(FILMS_MOST_COMMENTED_TITLE));
    const filmsMostCommentedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[1];
    this._filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector('.films-list__container');

    this._getFilmsMostCommented();
  }

  _renderFilmsListContainer() {
    this._filmsListContainerComponent = new FilmsListContainerView();

    render(this._filmsListComponent, this._filmsListContainerComponent);
  }

  _renderBoard() {
    const filmCards = this._getFilms();
    const filmCardCount = filmCards.length;

    if (filmCardCount === 0) {
      this._renderNoFilmCards();
      return;
    }

    this._renderFilmsListContainer();

    this._renderSort();

    this._renderFilmCards(filmCards.slice(0, Math.min(filmCardCount, this._renderedFilmsCardCount)));

    if (filmCardCount > this._renderedFilmsCardCount) {
      this._renderShowMoreButton();
    }

    this._renderFilmsTopRated();
    this._renderfilmsMostCommented();
  }
}
