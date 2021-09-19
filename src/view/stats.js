import AbstractView from './abstract.js';

const createStatsTemplate = () => (
  `<a href="#stats" id="stats" class="main-navigation__additional">Stats
  </a>`
);

export default class Stats extends AbstractView {
  getTemplate() {
    return createStatsTemplate();
  }
}
