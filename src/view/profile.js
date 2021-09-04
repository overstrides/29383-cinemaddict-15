import AbstractView from './abstract.js';

const createProfileTemplate = (filmsCards) => {
  const getUserRating = () => {
    let userTitle = '';
    let userFilmsWatched = 0;

    filmsCards.forEach((filmCard) => {
      if (filmCard.isWatched) {
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

export default class Profile extends AbstractView {
  constructor(filmsCards) {
    super();
    this._filmsCards = filmsCards;
  }

  getTemplate() {
    return createProfileTemplate(this._filmsCards);
  }
}
