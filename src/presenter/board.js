import { FILMS_STEP_NUMBER, FILMS_EXTRA_NUMBER, FILMS_TOP_RATED_TITLE, FILMS_MOST_COMMENTED_TITLE, SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { getRandomInt, isOnline } from '../utils/common.js';
import { RenderPosition, render, remove } from '../utils/render.js';
import { sortByDate, sortByRating } from '../utils/film.js';
import { filter } from '../utils/filter.js';
import { toast } from '../utils/toast.js';
import ProfileView from '../view/profile.js';
import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainerView from '../view/films-list-container.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreView from '../view/show-more.js';
import NoFilmCardsView from '../view/no-film-cards.js';
import CardPresenter from './card.js';

export default class Board {
  constructor(boardContainer, filmsModel, filterModel, api) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;
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
    this._profileComponent = null;
    this._mode = 'DEFAULT';
    this._isLoading = true;
    this._countOpenCards = 0;
    this._countCloseCards = 0;

    this._filmsComponent = new FilmsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._updateMostCommentedComponent = this._updateMostCommentedComponent.bind(this);
    this._updateFilteredFilmList = this._updateFilteredFilmList.bind(this);
    this._openCard = this._openCard.bind(this);
    this._closeCard = this._closeCard.bind(this);
  }

  init() {
    const films = this._filmsModel.getFilms().slice();
    const filtredFilms = filter[this._filterType](films);
    this._filmCardsOnPage = Math.min(filtredFilms.length, FILMS_STEP_NUMBER);
    this._siteHeaderElement = document.querySelector('.header');

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

  _openCard() {
    this._countOpenCards += 1;
  }

  _closeCard() {
    this._countCloseCards += 1;
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

  _handleViewAction(actionType, updateType, updateFilmCard, updateComment, mode, filterType = FilterType.ALL, scrollPosition = 0) {
    this._mode = mode;
    this._filterFilmChange = filterType === 'watched' ? 'history' : filterType;
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this._api.updateFilmCard(updateFilmCard).then((response) => {
          this._filmsModel.updateFilmCard(updateType, response, null, filterType);
          if (this._mode === 'EDITING') {
            this._filmCardsPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
            if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
              this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
            }
            if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
              this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
            }
          }
        });
        break;
      case UserAction.ADD_COMMENT:
        this._filmCardsPresenter.get(updateFilmCard.id).setActionAddingComment();
        if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
          this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setActionAddingComment();
        }
        if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
          this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setActionAddingComment();
        }
        this._api.addComment(updateFilmCard, updateComment).then((response) => {
          this._filmsModel.addComment(updateType, updateFilmCard, response);
          this._filmCardsPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
          if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
            this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
          }
          if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
            this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
          }
        })
          .catch(() => {
            this._filmCardsPresenter.get(updateFilmCard.id).setCancelActionAddingComment();
            if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
              this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setCancelActionAddingComment();
            }
            if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
              this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setCancelActionAddingComment();
            }
            if (!isOnline()) {
              toast('You can\'t add comment offline');
              this._filmCardsPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
              if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
                this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
              }
              if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
                this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
              }
            }
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._filmCardsPresenter.get(updateFilmCard.id).setActionDeletingComment();
        if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
          this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setActionDeletingComment();
        }
        if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
          this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setActionDeletingComment();
        }
        this._api.deleteComment(updateComment).then(() => {
          this._filmsModel.deleteComment(updateType, updateFilmCard, updateComment);
          this._filmCardsPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
          if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
            this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
          }
          if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
            this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
          }
        })
          .catch(() => {
            this._filmCardsPresenter.get(updateFilmCard.id).setCancelActionDeletingComment();
            if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
              this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setCancelActionDeletingComment();
            }
            if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
              this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setCancelActionDeletingComment();
            }
            if (!isOnline()) {
              toast('You can\'t delete comment offline');
              this._filmCardsPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
              if(this._filmCardsTopRatedPresenter.has(updateFilmCard.id)) {
                this._filmCardsTopRatedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
              }
              if(this._filmCardsMostCommentedPresenter.has(updateFilmCard.id)) {
                this._filmCardsMostCommentedPresenter.get(updateFilmCard.id).setFilmDetailsScrollPosition(scrollPosition);
              }
            }
          });
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
        this._renderProfile();
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
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedCardCount: true, resetSortType: true});
        this._renderCardList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._noFilmCardsComponent);
        this._renderBoard();
        break;
    }
  }

  _renderProfile() {
    if (this._profileComponent !== null) {
      remove(this._profileComponent);
    }

    const filmCards = this._getFilms();

    this._profileComponent = new ProfileView(filmCards);

    render(this._siteHeaderElement, this._profileComponent);
  }

  _updateFilteredFilmList() {
    if (this._countOpenCards > this._countCloseCards) {
      return;
    }
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

  _renderNoFilmCards(text = '') {
    this._noFilmCardsComponent = new NoFilmCardsView(text);
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

    const cardPresenter = new CardPresenter(this._boardContainer, comments, this._handleViewAction, this._handleModeChange, this._updateMostCommentedComponent, this._updateFilteredFilmList, this._openCard, this._closeCard);
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
      this._renderNoFilmCards(this._filterType);
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
      this._renderNoFilmCards(this._filterType);
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
    let ratingFilmCards = [];
    this._sortedFilmsCardsByRating = this._getFilmsNoFiltered().slice().sort((a, b) => b.totalRating - a.totalRating);
    const isFilmsRatingEqual = this._sortedFilmsCardsByRating.every((filmCard, filmCardIndex, array) => filmCard.rating === array[0].rating);

    if (isFilmsRatingEqual && this._sortedFilmsCardsByRating[0].rating === 0) {
      return;
    }

    if (isFilmsRatingEqual) {
      const firstIndex = getRandomInt(1, this._sortedFilmsCardsByRating.length - 1);
      const secondIndex = getRandomInt(1, this._sortedFilmsCardsByRating.length - 1);
      ratingFilmCards.push(this._sortedFilmsCardsByRating[firstIndex]);
      secondIndex !== firstIndex ? ratingFilmCards.push(this._sortedFilmsCardsByRating[secondIndex]) : ratingFilmCards.push(this._sortedFilmsCardsByRating[0]);
    } else {
      ratingFilmCards = this._sortedFilmsCardsByRating
        .slice(0, Math.min(this._sortedFilmsCardsByRating.length, FILMS_EXTRA_NUMBER));
    }

    this._filmsListTopRatedComponent = new FilmsListExtraView(FILMS_TOP_RATED_TITLE);
    render(this._filmsComponent, this._filmsListTopRatedComponent);
    const filmsTopRatedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[0];
    this._filmsTopRatedContainerElement = filmsTopRatedElement.querySelector('.films-list__container');

    ratingFilmCards
      .forEach((sortedCard) => {
        this._renderFilmCard(this._filmsTopRatedContainerElement, sortedCard);
      });
  }

  _getFilmsMostCommented() {
    let commentedFilmCards = [];
    this._sortedFilmsCardsByComments = this._getFilmsNoFiltered().slice().sort((a, b) => b.commentsId.length - a.commentsId.length);
    const isAmountFilmCommentsEqual = this._sortedFilmsCardsByComments.every((filmCard, filmCardIndex, array) => filmCard.commentsId.length === array[0].commentsId.length);

    if(isAmountFilmCommentsEqual && this._sortedFilmsCardsByComments[0].commentsId.length === 0) {
      remove(this._filmsListMostCommentedComponent);
      return;
    }

    if(isAmountFilmCommentsEqual) {
      const firstIndex = getRandomInt(1, this._sortedFilmsCardsByComments.length - 1);
      const secondIndex = getRandomInt(1, this._sortedFilmsCardsByComments.length - 1);
      commentedFilmCards.push(this._sortedFilmsCardsByComments[firstIndex]);
      secondIndex !== firstIndex ? commentedFilmCards.push(this._sortedFilmsCardsByComments[secondIndex]) : commentedFilmCards.push(this._sortedFilmsCardsByComments[0]);
    } else {
      commentedFilmCards = this._sortedFilmsCardsByComments
        .slice(0, Math.min(this._sortedFilmsCardsByComments.length, FILMS_EXTRA_NUMBER));
    }

    commentedFilmCards
      .forEach((sortedCard) => {
        this._renderFilmCard(this._filmsMostCommentedContainerElement, sortedCard);
      });
  }

  _renderfilmsMostCommented() {
    this._filmsListMostCommentedComponent = new FilmsListExtraView(FILMS_MOST_COMMENTED_TITLE);
    render(this._filmsComponent, this._filmsListMostCommentedComponent);
    const filmsMostCommentedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[1];
    this._filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector('.films-list__container');

    this._getFilmsMostCommented();
  }

  _renderFilmsListContainer() {
    this._filmsListContainerComponent = new FilmsListContainerView();

    render(this._filmsListComponent, this._filmsListContainerComponent);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderNoFilmCards();
      return;
    }

    const filmCards = this._getFilms();
    const filmCardCount = filmCards.length;

    this._renderProfile();

    if (filmCardCount === 0) {
      this._renderNoFilmCards(this._filterType);
      return;
    }

    this._renderFilmsListContainer();

    this._renderSort();

    this._renderFilmCards(filmCards.slice(0, Math.min(filmCardCount, this._renderedFilmsCardCount)));
    this._filmCardsOnPage = Math.min(filmCardCount, this._renderedFilmsCardCount);

    if (filmCardCount > this._renderedFilmsCardCount) {
      this._renderShowMoreButton();
    }

    this._renderFilmsTopRated();
    this._renderfilmsMostCommented();
  }
}
