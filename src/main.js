import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createSortTemplate} from './view/sort.js';
import {createSiteStatisticsTemplate} from './view/site-statistics.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createFilmDetailsTemplate} from './view/film-details.js';

const FILMS_QUANTITY = 5;
const FILMS_QUANTITY_EXTRA = 2;
const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteFooterStatisticsElement, createSiteStatisticsTemplate(), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const filmsElement = document.querySelector('.films');

render(filmsElement, createFilmsListTemplate(), 'beforeend');

const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

for (let i = 0; i < FILMS_QUANTITY; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(), 'beforeend');
}

render(filmsListElement, createShowMoreTemplate(), 'beforeend');
render(filmsElement, createFilmsListExtraTemplate(TOP_RATED_TITLE), 'beforeend');
render(filmsElement, createFilmsListExtraTemplate(MOST_COMMENTED_TITLE), 'beforeend');

const filmsTopRatedElement = filmsElement.querySelectorAll('.films-list--extra')[0];
const filmsTopRatedContainerElement = filmsTopRatedElement.querySelector('.films-list__container');
const filmsMostCommentedElement = filmsElement.querySelectorAll('.films-list--extra')[1];
const filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector('.films-list__container');

for (let i = 0; i < FILMS_QUANTITY_EXTRA; i++) {
  render(filmsTopRatedContainerElement, createFilmCardTemplate(), 'beforeend');
}

for (let i = 0; i < FILMS_QUANTITY_EXTRA; i++) {
  render(filmsMostCommentedContainerElement, createFilmCardTemplate(), 'beforeend');
}

const bodyElement = document.querySelector('body');

render(bodyElement, createFilmDetailsTemplate(), 'beforeend');
