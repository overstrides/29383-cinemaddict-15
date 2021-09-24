import FilmsModel from '../model/films.js';
import {isOnline} from '../utils/common.js';

const getSyncedFilms = (items) => {
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) =>
  items
    .reduce((accumulator, currentValue) => Object.assign({}, accumulator, {
      [currentValue.id]: currentValue,
    }), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((movies) => {
          const items = createStoreStructure(movies.map(FilmsModel.adaptFilmCardToServer));
          this._store.setItems(items);
          return movies;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptFilmCardToClient));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId)
        .then((comments) => {
          const items = createStoreStructure(comments.map(FilmsModel.adaptFilmCommentToServer));
          this._store.setItem(items);

          return comments;
        });
    }

    return Promise.reject(new Error('Get comments failed'));
  }

  updateFilmCard(film) {
    if (isOnline()) {
      return this._api.updateFilmCard(film)
        .then((updatedFilmCard) => {
          this._store.setItem(updatedFilmCard.id, FilmsModel.adaptFilmCardToServer(updatedFilmCard));
          return updatedFilmCard;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptFilmCardToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  addComment(film, comment) {
    if (isOnline()) {
      return this._api.addComment(film, comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, FilmsModel.adaptFilmCommentToServer(newComment));
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => this._store.removeItem(comment.id));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
