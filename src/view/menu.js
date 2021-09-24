import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const createMenyItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  let navigationItem = '';

  if (type !== 'all')  {
    navigationItem = `<span class="main-navigation__item-count">${count}</span>`;
  }

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" id="${type}">${name} ${navigationItem}</a>`
  );
};

const createMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMenyItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`;
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    if (evt.target.id === FilterType.ALL && evt.target.className !== 'main-navigation__item--active') {
      evt.target.classList.add('main-navigation__item--active');
    }

    this._callback.filterTypeChange(evt.target.id);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
