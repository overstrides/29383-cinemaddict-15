import { UpdateType, FilterType, NavigationItem, StatisticsRange, AUTHORIZATION, END_POINT } from './const.js';
import { render, remove } from './utils/render.js';
import { getWatchedFilms, getWatchedFilmsByRange } from './utils/statistics.js';
import ProfileView from './view/profile.js';
import NavigationView from './view/navigation.js';
import StatsView from './view/stats.js';
import StatsContentView from './view/stats-content.js';
import SiteStatisticsView from './view/site-statistics.js';
import BoardPresenter from './presenter/board.js';
import FilmsModel from './model/films.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filter.js';
import Api from './api.js';

let isFilmsDisplayed = true;
let isStatsDisplayed = false;
let statsContentComponent = null;
let currentRange = StatisticsRange.ALL;
let totalFilmsWatched = [];
let filmCardsForStats = [];

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const navigationComponent = new NavigationView();
const statsComponent = new StatsView();
const boardPresenter = new BoardPresenter(bodyElement, filmsModel, filterModel, api);
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

render(siteMainElement, navigationComponent);
render(navigationComponent, statsComponent);

filterPresenter.init();
boardPresenter.init();

api.getFilms()
  .then((filmsCards) => {
    const commentsRequests = [];
    const filmComments = [];

    filmsCards.map((filmsCard) => {
      commentsRequests.push(api.getComments(filmsCard.id));
    });

    Promise.all(commentsRequests)
      .then((comments) => {
        comments.forEach((commentList) => {
          commentList.forEach((commentItem) => {
            filmComments.push(commentItem);
          });
        });
        filmsModel.setFilms(UpdateType.INIT, filmsCards, filmComments);
        render(siteHeaderElement, new ProfileView(filmsCards));
        render(siteFooterStatisticsElement, new SiteStatisticsView(filmsCards));
        navigationComponent.setNavigationHandler(handleNavigationClick);
      });
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, [], []);
    render(siteHeaderElement, new ProfileView([]));
    render(siteFooterStatisticsElement, new SiteStatisticsView([]));
    navigationComponent.setNavigationHandler(handleNavigationClick);
  });
