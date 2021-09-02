import AbstractView from './abstract.js';

const createFilmsListTemplate = (isNotEmpty = true) => {
  const content = isNotEmpty
    ? `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
       <div class="films-list__container">
       </div>`
    : `<h2 class="films-list__title">There are no movies in our database
       </h2>`;

  return `<section class="films-list">
    ${content}
  </section>`;
};

export default class FilmsList extends AbstractView {
  constructor(isNotEmpty) {
    super();
    this._isNotEmpty = isNotEmpty;
  }

  getTemplate() {
    return createFilmsListTemplate(this._isNotEmpty);
  }
}
