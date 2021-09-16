import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const NoFilmCardsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies in watchlist now',
  [FilterType.HISTORY]: 'There are no movies in history now',
  [FilterType.FAVORITES]: 'There are no movies in favorites now',
};

const createNoFilmCardsTemplate = (filterType) => {
  const noFilmCardsTextValue = NoFilmCardsTextType[filterType];

  return (
    `<h2 class="films-list__title">
      ${noFilmCardsTextValue}
    </h2>`);
};

export default class NoFilmCards extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoFilmCardsTemplate(this._data);
  }
}
