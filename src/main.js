import { FILMS_NUMBER, FILMS_STEP_NUMBER, FILMS_EXTRA_NUMBER, FILMS_TOP_RATED_TITLE, FILMS_MOST_COMMENTED_TITLE } from './const.js';
import { RenderPosition, render, remove } from './utils/render.js';
import { getFilmDetailsData } from './utils/film.js';
import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import SortView from './view/sort.js';
import SiteStatisticsView from './view/site-statistics.js';
import FilmCardView from './view/film-card.js';
import ShowMoreView from './view/show-more.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import FilmsListExtraView from './view/films-list-extra.js';
import FilmDetailsView from './view/film-details.js';
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

render(siteHeaderElement, new ProfileView(filmsCards), RenderPosition.BEFOREEND);
render(siteMainElement, new MenuView(filmsCards), RenderPosition.BEFOREEND);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
render(siteFooterStatisticsElement, new SiteStatisticsView(filmsCards), RenderPosition.BEFOREEND);

const renderFilmCard = (filmCardsContainer, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);
  const filmDetailsCard = getFilmDetailsData(filmCard, filmsComments);
  const filmDetailsComponent = new FilmDetailsView(filmDetailsCard);

  const openFilmDetails = () => {
    bodyElement.appendChild(filmDetailsComponent.getElement());
    bodyElement.classList.add('hide-overflow');
  };

  const closeFilmDetails = () => {
    bodyElement.removeChild(filmDetailsComponent.getElement());
    bodyElement.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeFilmDetails();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmCardComponent.setOpenFilmDetails(() => {
    openFilmDetails();
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmDetailsComponent.setCloseFilmDetails(() => {
    closeFilmDetails();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmCardsContainer, filmCardComponent, RenderPosition.BEFOREEND);
};

const renderFilmsBoard = (container, cards) => {
  const filmsComponent = new FilmsView();
  const isNotEmpty = Boolean(cards.length);
  const filmsListComponent = new FilmsListView(isNotEmpty);

  render(container, filmsComponent, RenderPosition.BEFOREEND);
  render(filmsComponent, filmsListComponent, RenderPosition.BEFOREEND);

  if (!isNotEmpty) {
    return;
  }

  const filmsListContainerElement = filmsListComponent.getElement().querySelector('.films-list__container');

  cards
    .slice(0, Math.min(cards.length, FILMS_STEP_NUMBER))
    .forEach((filmCard) => {
      renderFilmCard(filmsListContainerElement, filmCard);
    });

  if (cards.length > FILMS_STEP_NUMBER) {
    let renderedFilmsCardCount = FILMS_STEP_NUMBER;

    const showMoreComponent = new ShowMoreView();
    render(filmsListComponent, showMoreComponent, RenderPosition.BEFOREEND);

    showMoreComponent.setClickHandler(() => {
      cards
        .slice(renderedFilmsCardCount, renderedFilmsCardCount + FILMS_STEP_NUMBER)
        .forEach((filmCard) => renderFilmCard(filmsListContainerElement, filmCard));

      renderedFilmsCardCount += FILMS_STEP_NUMBER;

      if (renderedFilmsCardCount >= cards.length) {
        remove(showMoreComponent);
      }
    });
  }

  render(filmsComponent, new FilmsListExtraView(FILMS_TOP_RATED_TITLE), RenderPosition.BEFOREEND);
  render(filmsComponent, new FilmsListExtraView(FILMS_MOST_COMMENTED_TITLE), RenderPosition.BEFOREEND);

  const filmsTopRatedElement = filmsComponent.getElement().querySelectorAll('.films-list--extra')[0];
  const filmsTopRatedContainerElement = filmsTopRatedElement.querySelector('.films-list__container');
  const filmsMostCommentedElement = filmsComponent.getElement().querySelectorAll('.films-list--extra')[1];
  const filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector('.films-list__container');

  const sortedFilmsCardsByRating = cards.slice().sort((a, b) => b.totalRating - a.totalRating);

  sortedFilmsCardsByRating
    .slice(0, Math.min(sortedFilmsCardsByRating.length, FILMS_EXTRA_NUMBER))
    .forEach((sortedCard) => {
      renderFilmCard(filmsTopRatedContainerElement, sortedCard);
    });

  const sortedFilmsCardsByComments = cards.slice().sort((a, b) => b.commentsId.length - a.commentsId.length);

  sortedFilmsCardsByComments
    .slice(0, Math.min(sortedFilmsCardsByComments.length, FILMS_EXTRA_NUMBER))
    .forEach((sortedCard) => {
      renderFilmCard(filmsMostCommentedContainerElement, sortedCard);
    });
};

renderFilmsBoard(siteMainElement, filmsCards);
