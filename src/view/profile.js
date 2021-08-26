import { createElement } from '../utils.js';

const createProfileTemplate = (filmsCards) => {
  const getUserRating = () => {
    let userTitle = '';
    let userFilmsWatched = 0;

    filmsCards.forEach((filmCard) => {
      if (filmCard.userDetails.isWatched) {
        userFilmsWatched += 1;
      }
    });

    if (userFilmsWatched > 0 && userFilmsWatched <= 10) {
      userTitle = 'novice';
    } else if (userFilmsWatched > 10 && userFilmsWatched < 20) {
      userTitle = 'fan';
    } else {
      userTitle = 'movie buff';
    }

    const user = userFilmsWatched > 0 ? `<p class="profile__rating">${userTitle}</p>` : '';

    return user;
  };

  const userRating = getUserRating();

  return `<section class="header__profile profile">
    ${userRating}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile {
  constructor(filmsCards) {
    this._filmsCards = filmsCards;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._filmsCards);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
