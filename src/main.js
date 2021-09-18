import { FILMS_NUMBER, UpdateType, FilterType, NavigationItem, StatisticsRange } from './const.js';
import { render, remove } from './utils/render.js';
import { getWatchedFilms, getWatchedFilmsByRange } from './utils/statistics.js';
import ProfileView from './view/profile.js';
import NavigationView from './view/navigation.js';
import StatsView from './view/stats.js';
import StatsContentView from './view/stats-content.js';
import SiteStatisticsView from './view/site-statistics.js';
import BoardPresenter from './presenter/board.js';
import { generateFilmCard } from './mock/film-card-mock.js';
import { generateFilmComments } from './mock/film-comments-mock.js';
import FilmsModel from './model/films.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filter.js';

const filmsComments = [];
let isFilmsDisplayed = true;
let isStatsDisplayed = false;
let statsContentComponent = null;
let currentRange = StatisticsRange.ALL;
let totalFilmsWatched = [];
let filmCardsForStats = [];

const filmsCards = new Array(FILMS_NUMBER).fill().map(() => {
  const filmCommentsData = generateFilmComments();
  const filmComments = filmCommentsData[0];
  const filmCommentsId = filmCommentsData[1];

  filmComments.forEach((item) => {
    filmsComments.push(item);
  });

  return generateFilmCard(filmCommentsId);
});

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsCards);
filmsModel.setComments(filmsComments);

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView(filmsCards));
render(siteFooterStatisticsElement, new SiteStatisticsView(filmsCards));

const navigationComponent = new NavigationView();
const statsComponent = new StatsView();
const boardPresenter = new BoardPresenter(bodyElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(navigationComponent, filterModel, filmsModel);

const renderStatsContent = () => {
  if (statsContentComponent !== null) {
    remove(statsContentComponent);
  }

  totalFilmsWatched = getWatchedFilms(filmsModel.getFilms());
  filmCardsForStats = getWatchedFilmsByRange(totalFilmsWatched, currentRange);
  statsContentComponent = new StatsContentView(filmCardsForStats, currentRange);
  render(siteMainElement, statsContentComponent);
};

const handleStatsChange = (range) => {
  if (currentRange === range) {
    return;
  }

  currentRange = range;
  totalFilmsWatched = getWatchedFilms(filmsModel.getFilms());
  filmCardsForStats = getWatchedFilmsByRange(totalFilmsWatched, range);
  renderStatsContent();
  statsContentComponent.setStatsChangeHandler(handleStatsChange);
};

const handleNavigationClick = (navigationItem) => {
  if ((navigationItem === NavigationItem.STATS && isStatsDisplayed) || (navigationItem === NavigationItem.FILMS && isFilmsDisplayed)) {
    return;
  }

  switch (navigationItem) {
    case NavigationItem.FILMS:
      if (statsContentComponent !== null) {
        remove(statsContentComponent);
        currentRange = StatisticsRange.ALL;
      }
      boardPresenter.init();
      statsComponent.getElement().classList.remove('main-navigation__additional--active');
      isFilmsDisplayed = true;
      isStatsDisplayed = false;
      break;
    case NavigationItem.STATS:
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      renderStatsContent();
      statsContentComponent.setStatsChangeHandler(handleStatsChange);
      statsComponent.getElement().classList.add('main-navigation__additional--active');
      navigationComponent.getElement().querySelector('#all').classList.remove('main-navigation__item--active');
      isFilmsDisplayed = false;
      isStatsDisplayed = true;
      break;
  }
};

navigationComponent.setNavigationHandler(handleNavigationClick);

render(siteMainElement, navigationComponent);
render(navigationComponent, statsComponent);

filterPresenter.init();
boardPresenter.init();
