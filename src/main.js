import { FILMS_NUMBER } from './const.js';
import { render } from './utils/render.js';
import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import SiteStatisticsView from './view/site-statistics.js';
import BoardPresenter from './presenter/board.js';
import { generateFilmCard } from './mock/film-card-mock.js';
import { generateFilmComments } from './mock/film-comments-mock.js';

const filmsComments = [];

const filmsCards = new Array(FILMS_NUMBER).fill().map(() => {
  const filmCommentsData = generateFilmComments();
  const filmComments = filmCommentsData[0];
  const filmCommentsId = filmCommentsData[1];

  filmComments.forEach((item) => {
    filmsComments.push(item);
  });

  return generateFilmCard(filmCommentsId);
});

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView(filmsCards));
render(siteMainElement, new MenuView(filmsCards));
render(siteFooterStatisticsElement, new SiteStatisticsView(filmsCards));

const boardPresenter = new BoardPresenter(bodyElement);
boardPresenter.init(filmsCards, filmsComments);
