import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
    this._comments = [];
  }

  setFilms(updateType, films, comments) {
    this._films = films.slice();
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
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
    const addedComment = updateFilmComment[updateFilmComment.length -1];
    updateFilmCard.commentsId.push(addedComment.id);
    updateFilmCard.isDisabled = false;

    if (index === -1) {
      throw new Error('Can\'t update unexisting filmCard');
    }

    this._films = [
      ...this._films.slice(0, index),
      updateFilmCard,
      ...this._films.slice(index + 1),
    ];

    this._comments = [
      ...this._comments,
      addedComment,
    ];

    this._notify(updateType, updateFilmCard, updateFilmComment);
  }

  deleteComment(updateType, updateFilmCard, updateFilmComment) {
    const indexFilmCard = this._films.findIndex((film) => film.id === updateFilmCard.id);
    let deletedCommentIndex = null;

    if (indexFilmCard === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    updateFilmCard.commentsId.forEach((commentId, index) => {
      if (commentId === updateFilmComment) {
        deletedCommentIndex = index;
      }
    });

    updateFilmCard.commentsId = [
      ...updateFilmCard.commentsId.slice(0, deletedCommentIndex),
      ...updateFilmCard.commentsId.slice(deletedCommentIndex + 1),
    ];

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

  static adaptFilmCardToClient(filmCard) {
    const adaptedFilmCard = Object.assign(
      {},
      filmCard,
      {
        poster: filmCard['film_info']['poster'],
        title: filmCard['film_info']['title'],
        alternativeTitle: filmCard['film_info']['alternative_title'],
        totalRating: filmCard['film_info']['total_rating'],
        directors: filmCard['film_info']['director'],
        writers: filmCard['film_info']['writers'],
        actors: filmCard['film_info']['actors'],
        release: {
          date: filmCard['film_info']['release']['date'] !== null ? new Date(filmCard['film_info']['release']['date']) : null,
          country: filmCard['film_info']['release']['release_country'],
        },
        runtime: filmCard['film_info']['runtime'],
        genres: filmCard['film_info']['genre'],
        description: filmCard['film_info']['description'],
        ageRating: filmCard['film_info']['age_rating'],
        isInWatchlist: filmCard['user_details']['watchlist'],
        isWatched: filmCard['user_details']['already_watched'],
        isInFavorite: filmCard['user_details']['favorite'],
        watchingDate: filmCard['user_details']['watching_date'] !== null ? new Date(filmCard['user_details']['watching_date']) : null,
        commentsId: filmCard['comments'],
        isDisabled: false,
      },
    );

    delete adaptedFilmCard['film_info'];
    delete adaptedFilmCard['user_details'];
    delete adaptedFilmCard['comments'];

    return adaptedFilmCard;
  }

  static adaptFilmCardToServer(filmCard) {
    const adaptedFilmCard = Object.assign(
      {},
      filmCard,
      {
        'film_info': {
          'poster': filmCard.poster,
          'title': filmCard.title,
          'alternative_title': filmCard.alternativeTitle,
          'total_rating': filmCard.totalRating,
          'director': filmCard.directors,
          'writers': filmCard.writers,
          'actors': filmCard.actors,
          'release': {
            'date': filmCard.release.date instanceof Date ? filmCard.release.date.toISOString() : null,
            'release_country': filmCard.release.country,
          },
          'runtime': filmCard.runtime,
          'genre': filmCard.genres,
          'description': filmCard.description,
          'age_rating': filmCard.ageRating,
        },
        'user_details': {
          'watchlist': filmCard.isInWatchlist,
          'already_watched': filmCard.isWatched,
          'favorite': filmCard.isInFavorite,
          'watching_date': filmCard.watchingDate instanceof Date ? filmCard.watchingDate.toISOString() : null,
        },
        'comments': filmCard.commentsId,
      },
    );

    delete adaptedFilmCard.poster;
    delete adaptedFilmCard.title;
    delete adaptedFilmCard.alternativeTitle;
    delete adaptedFilmCard.totalRating;
    delete adaptedFilmCard.directors;
    delete adaptedFilmCard.writers;
    delete adaptedFilmCard.actors;
    delete adaptedFilmCard.release;
    delete adaptedFilmCard.runtime;
    delete adaptedFilmCard.genres;
    delete adaptedFilmCard.ageRating;
    delete adaptedFilmCard.isInWatchlist;
    delete adaptedFilmCard.isWatched;
    delete adaptedFilmCard.isInFavorite;
    delete adaptedFilmCard.watchingDate;
    delete adaptedFilmCard.commentsId;
    delete adaptedFilmCard.isDisabled;

    return adaptedFilmCard;
  }

  static adaptFilmCommentToClient(comment) {
    const adaptedFilmComment = Object.assign(
      {},
      comment,
      {
        text: comment['comment'],
      },
    );

    delete adaptedFilmComment['comment'];

    return adaptedFilmComment;
  }

  static adaptFilmCommentToServer(comment) {
    const adaptedFilmComment = Object.assign(
      {},
      comment,
      {
        'comment': comment.text,
      },
    );

    delete adaptedFilmComment.text;

    return adaptedFilmComment;
  }
}
