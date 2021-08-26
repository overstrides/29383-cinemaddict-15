import { createElement } from '../utils.js';

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

export default class FilmsList {
  constructor(isNotEmpty) {
    this._element = null;
    this._isNotEmpty = isNotEmpty;
  }

  getTemplate() {
    return createFilmsListTemplate(this._isNotEmpty);
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
