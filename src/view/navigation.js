import AbstractView from './abstract.js';
import { NavigationItem } from '../const.js';

const createNavigationTemplate = () => (
  `<nav class="main-navigation">
  </nav>`
);

export default class Navigation extends AbstractView {
  constructor() {
    super();
    this._isShowFilmCards = false;
    this._isShowStats = false;
    this._navigationHandler = this._navigationHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate();
  }

  _navigationHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    let navigationItem = '';

    if (evt.target.id !== 'stats') {
      navigationItem = NavigationItem.FILMS;
    } else {
      navigationItem = NavigationItem.STATS;
    }

    this._callback.menuClick(navigationItem);
  }

  setNavigationHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._navigationHandler);
  }
}
