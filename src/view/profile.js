import { getUserRating } from '../utils/film.js';
import AbstractView from './abstract.js';

const createProfileTemplate = (filmsCards) => {
  const userRating = getUserRating(filmsCards);
  const userTitle = userRating !== '' ? `<p class="profile__rating">${userRating}</p>` : '';

  return `<section class="header__profile profile">
    ${userTitle}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile extends AbstractView {
  constructor(filmsCards) {
    super();
    this._filmsCards = filmsCards;
  }

  getTemplate() {
    return createProfileTemplate(this._filmsCards);
  }
}
