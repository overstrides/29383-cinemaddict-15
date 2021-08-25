import { createElement } from '../utils.js';

const createSiteStatisticsTemplate = (filmsCards) => (
  `<p>${filmsCards.length} movies inside
  </p>`
);

export default class SiteStatistics {
  constructor(filmsCards) {
    this._filmsCards = filmsCards;
    this._element = null;
  }

  getTemplate() {
    return createSiteStatisticsTemplate(this._filmsCards);
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
