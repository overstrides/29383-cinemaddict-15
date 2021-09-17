import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
    this._comments = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  updateFilmCard(updateType, update, filterType) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting filmCard');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update, filterType);
  }

  addComment(updateType, updateFilmCard, updateFilmComment) {
    const index = this._films.findIndex((film) => film.id === updateFilmCard.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting filmCard');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateFilmCard,
      ...this._films.slice(index + 1),
    ];

    this._comments = [
      updateFilmComment,
      ...this._comments,
    ];

    this._notify(updateType, updateFilmCard, updateFilmComment);
  }

  deleteComment(updateType, updateFilmCard, updateFilmComment) {
    const indexFilmCard = this._films.findIndex((film) => film.id === updateFilmCard.id);

    if (indexFilmCard === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._films = [
      ...this._films.slice(0, indexFilmCard),
      updateFilmCard,
      ...this._films.slice(indexFilmCard + 1),
    ];

    const indexFilmComment = this._comments.findIndex((comment) => comment.id === updateFilmComment);

    this._comments = [
      ...this._comments.slice(0, indexFilmComment),
      ...this._comments.slice(indexFilmComment + 1),
    ];

    this._notify(updateType, updateFilmCard);
  }
}
