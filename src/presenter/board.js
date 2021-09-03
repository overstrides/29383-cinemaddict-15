import { FILMS_STEP_NUMBER, FILMS_EXTRA_NUMBER, FILMS_TOP_RATED_TITLE, FILMS_MOST_COMMENTED_TITLE } from '../const.js';
import { RenderPosition, render, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import ShowMoreView from '../view/show-more.js';
import CardPresenter from './card.js';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._siteMainElement = boardContainer.querySelector('.main');
    this._renderedFilmsCardCount = FILMS_STEP_NUMBER;
    this._filmCardsPresenter = new Map();
    this._filmCardsTopRatedPresenter = new Map();
    this._filmCardsMostCommentedPresenter = new Map();

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(boardCards, filmsComments) {
    this._boardCards = boardCards.slice();
    this._filmsComments = filmsComments.slice();
    this._isNotEmpty = Boolean(this._boardCards.length);

    this._filmsListComponent = new FilmsListView(this._isNotEmpty);

    render(this._siteMainElement, this._filmsComponent);
    render(this._filmsComponent, this._filmsListComponent);

    this._renderBoard();
  }

  _handleFilmCardChange(updatedFilmCard) {
    this._boardCards = updateItem(this._boardCards, updatedFilmCard);
    this._sortedFilmsCardsByRating = updateItem(this._sortedFilmsCardsByRating, updatedFilmCard);
    this._sortedFilmsCardsByComments = updateItem(this._sortedFilmsCardsByComments, updatedFilmCard);

    if(this._filmCardsPresenter.has(updatedFilmCard.id)) {
      this._filmCardsPresenter.get(updatedFilmCard.id).init(this._filmsListContainerElement, updatedFilmCard);
    }
    if(this._filmCardsTopRatedPresenter.has(updatedFilmCard.id)) {
      this._filmCardsTopRatedPresenter.get(updatedFilmCard.id).init(this._filmsTopRatedContainerElement, updatedFilmCard);
    }
    if(this._filmCardsMostCommentedPresenter.has(updatedFilmCard.id)) {
      this._filmCardsMostCommentedPresenter.get(updatedFilmCard.id).init(this._filmsMostCommentedContainerElement, updatedFilmCard);
    }
  }

  _handleModeChange() {
    this._filmCardsPresenter.forEach((presenter) => presenter.resetView());
    this._filmCardsTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this._filmCardsMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._filmsComponent, new SortView(), RenderPosition.AFTERBEGIN);
  }

  _renderFilmCard(filmCardsContainer, filmCard) {
    const cardPresenter = new CardPresenter(this._boardContainer, this._filmsComments, this._handleFilmCardChange, this._handleModeChange);
    cardPresenter.init(filmCardsContainer, filmCard);

    switch(filmCardsContainer) {
      case this._filmsListContainerElement:
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

  _renderFilmCards(from, to) {
    this._boardCards
      .slice(from, to)
      .forEach((filmCard) => {
        this._renderFilmCard(this._filmsListContainerElement, filmCard);
      })
  }

  _clearTaskList() {
    this._filmCardsPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardsPresenter.clear();
    this._renderedFilmsCardCount = FILMS_STEP_NUMBER;
    remove(this._showMoreComponent);
  }

  _renderCardList() {
    this._renderFilmCards(0, Math.min(this._boardCards.length, FILMS_STEP_NUMBER));

    if (this._boardCards.length > FILMS_STEP_NUMBER) {
      this._renderShowMoreButton();
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmsCardCount, this._renderedFilmsCardCount + FILMS_STEP_NUMBER)
    this._renderedFilmsCardCount += FILMS_STEP_NUMBER;

    if (this._renderedFilmsCardCount >= this._boardCards.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreComponent);

    this._showMoreComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsTopRated() {
    render(this._filmsComponent, new FilmsListExtraView(FILMS_TOP_RATED_TITLE));
    const filmsTopRatedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[0];
    this._filmsTopRatedContainerElement = filmsTopRatedElement.querySelector('.films-list__container');

    this._sortedFilmsCardsByRating = this._boardCards.slice().sort((a, b) => b.totalRating - a.totalRating);

    this._sortedFilmsCardsByRating
      .slice(0, Math.min(this._sortedFilmsCardsByRating.length, FILMS_EXTRA_NUMBER))
      .forEach((sortedCard) => {
        this._renderFilmCard(this._filmsTopRatedContainerElement, sortedCard);
      });
  }

  _renderfilmsMostCommented() {
    render(this._filmsComponent, new FilmsListExtraView(FILMS_MOST_COMMENTED_TITLE));
    const filmsMostCommentedElement = this._filmsComponent.getElement().querySelectorAll('.films-list--extra')[1];
    this._filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector('.films-list__container');

    this._sortedFilmsCardsByComments = this._boardCards.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

    this._sortedFilmsCardsByComments
      .slice(0, Math.min(this._sortedFilmsCardsByComments.length, FILMS_EXTRA_NUMBER))
      .forEach((sortedCard) => {
        this._renderFilmCard(this._filmsMostCommentedContainerElement, sortedCard);
      });
  }

  _renderBoard() {
    if (!this._isNotEmpty) {
      return;
    }

    this._renderSort();

    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector('.films-list__container');

    this._renderCardList();

    this._renderFilmsTopRated();
    this._renderfilmsMostCommented();
  }
}
