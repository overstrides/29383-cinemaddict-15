import AbstractView from './abstract.js';

const createSiteStatisticsTemplate = (filmsCards) => (
  `<p>${filmsCards.length} movies inside
  </p>`
);

export default class SiteStatistics extends AbstractView {
  constructor(filmsCards) {
    super();
    this._filmsCards = filmsCards;
  }

  getTemplate() {
    return createSiteStatisticsTemplate(this._filmsCards);
  }
}
