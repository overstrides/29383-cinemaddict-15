import { FILMS_NUMBER, FILMS_STEP_NUMBER, FILMS_EXTRA_NUMBER, FILMS_TOP_RATED_TITLE, FILMS_MOST_COMMENTED_TITLE } from './const.js';
import { createProfileTemplate } from './view/profile.js';
import { createMenuTemplate } from './view/menu.js';
import { createSortTemplate } from './view/sort.js';
import { createSiteStatisticsTemplate } from './view/site-statistics.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createShowMoreTemplate } from './view/show-more.js';
import { createFilmsTemplate } from './view/films.js';
import { createFilmsListTemplate } from './view/films-list.js';
import { createFilmsListExtraTemplate } from './view/films-list-extra.js';
import { createFilmDetailsTemplate } from './view/film-details.js';
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

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

render(siteHeaderElement, createProfileTemplate(filmsCards), 'beforeend');
render(siteMainElement, createMenuTemplate(filmsCards), 'beforeend');
render(siteMainElement, createSortTemplate(), 'beforeend');
render(siteFooterStatisticsElement, createSiteStatisticsTemplate(filmsCards), 'beforeend');
render(siteMainElement, createFilmsTemplate(), 'beforeend');

const filmsElement = document.querySelector('.films');

render(filmsElement, createFilmsListTemplate(), 'beforeend');

const filmsListElement = filmsElement.querySelector('.films-list');
const filmsListContainerElement = filmsElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(filmsCards.length, FILMS_STEP_NUMBER); i++) {
  render(filmsListContainerElement, createFilmCardTemplate(filmsCards[i]), 'beforeend');
}

if (filmsCards.length > FILMS_STEP_NUMBER) {
  let renderedFilmsCardCount = FILMS_STEP_NUMBER;

  render(filmsListElement, createShowMoreTemplate(), 'beforeend');

  const showMoreButtonElement = siteMainElement.querySelector('.films-list__show-more');

  showMoreButtonElement.addEventListener('click', (evt) => {
    evt.preventDefault();

    filmsCards.slice(renderedFilmsCardCount, renderedFilmsCardCount + FILMS_STEP_NUMBER).forEach((filmCard) => render(filmsListContainerElement, createFilmCardTemplate(filmCard), 'beforeend'));

    renderedFilmsCardCount += FILMS_STEP_NUMBER;

    if (renderedFilmsCardCount >= filmsCards.length) {
      showMoreButtonElement.remove();
    }
  });
}

render(filmsElement, createFilmsListExtraTemplate(FILMS_TOP_RATED_TITLE), 'beforeend');
render(filmsElement, createFilmsListExtraTemplate(FILMS_MOST_COMMENTED_TITLE), 'beforeend');

const filmsTopRatedElement = filmsElement.querySelectorAll('.films-list--extra')[0];
const filmsTopRatedContainerElement = filmsTopRatedElement.querySelector('.films-list__container');
const filmsMostCommentedElement = filmsElement.querySelectorAll('.films-list--extra')[1];
const filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector('.films-list__container');

const sortedFilmsCardsByRating = filmsCards.slice().sort((a, b) => b.totalRating - a.totalRating);

for (let i = 0; i < Math.min(sortedFilmsCardsByRating.length, FILMS_EXTRA_NUMBER); i++) {
  render(filmsTopRatedContainerElement, createFilmCardTemplate(sortedFilmsCardsByRating[i]), 'beforeend');
}

const sortedFilmsCardsByComments = filmsCards.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

for (let i = 0; i < Math.min(sortedFilmsCardsByComments.length, FILMS_EXTRA_NUMBER); i++) {
  render(filmsMostCommentedContainerElement, createFilmCardTemplate(sortedFilmsCardsByComments[i]), 'beforeend');
}

const bodyElement = document.querySelector('body');

const getFilmDetailsData = (filmCard, comments) => {
  const { commentsId } = filmCard;

  const filmComments = [];

  commentsId.forEach((commentId) => {
    comments.forEach((comment) => {
      if (comment.id === commentId) {
        filmComments.push(comment);
      }
    });
  });

  return [filmCard, filmComments];
};

const filmDetailsCard = getFilmDetailsData(filmsCards[0], filmsComments);

render(bodyElement, createFilmDetailsTemplate(filmDetailsCard), 'beforeend');
