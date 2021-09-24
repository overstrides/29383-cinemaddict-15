import dayjs from 'dayjs';
import { MINUTES_IN_HOUR, StatisticsRange } from '../const.js';

const getDuration = (duration = 0) => {
  const hours = parseInt((duration / MINUTES_IN_HOUR), 10);
  const minutes = duration % MINUTES_IN_HOUR;

  return {hours, minutes};
};

const getWatchedFilms = (cards) => {
  const watchedFilms = cards.slice().filter((card) => card.isWatched);
  return watchedFilms;
};

const getGenresRating = (genres) => {
  const resultReduce = genres.reduce((accumulator, currentValue) => {
    if (!accumulator.hash[currentValue]) {
      accumulator.hash[currentValue] = {[currentValue]: 1};
      accumulator.map.set(accumulator.hash[currentValue], 1);
      accumulator.result.push(accumulator.hash[currentValue]);
    } else {
      accumulator.hash[currentValue][currentValue] += 1;
      accumulator.map.set(accumulator.hash[currentValue], accumulator.hash[currentValue][currentValue]);
    }
    return accumulator;
  }, {
    hash: {},
    map: new Map(),
    result: [],
  });

  const genresRating = resultReduce.result.sort((elemA, elemB) => resultReduce.map.get(elemB) - resultReduce.map.get(elemA));

  return genresRating;
};

const getGenresList = (filmCards) => {
  let genres = [];
  const genresList = [];
  const quantityList = [];

  filmCards.forEach((filmCard) => {
    genres = genres.concat(filmCard.genres);
  });

  const genresRating = getGenresRating(genres);
  genresRating.forEach((item) => {
    genresList.push(Object.keys(item).toString());
    quantityList.push(parseInt(Object.values(item), 10));
  });

  return {
    genres: genresList,
    quantity: quantityList,
  };
};

const getMainGenre = (cards) => {
  let genres = [];

  cards.forEach((card) => {
    genres = genres.concat(card.genres);
  });

  let number = 0;
  let mainGenre = '';

  const genresRating = getGenresRating(genres);

  genresRating.forEach((item) => {
    if (Object.values(item) > number) {
      number = Object.values(item);
      mainGenre = Object.keys(item).toString();
    }
  });

  return mainGenre;
};

const getWatchedFilmsByRange = (filmCards, statsRange) => {
  let filmsWatched = [];
  const currentDate = dayjs().toDate();
  const todayDate = dayjs(currentDate).format('DD MM YYYY');
  const weekAgoDate = dayjs(currentDate).set('date', dayjs().get('date') - 7);
  const monthAgoDate = dayjs(currentDate).set('month', dayjs().get('month') - 1);
  const yearAgoDate = dayjs(currentDate).set('year', dayjs().get('year') - 1);

  switch (statsRange) {
    case StatisticsRange.ALL:
      filmsWatched = filmCards.slice();
      break;
    case StatisticsRange.TODAY:
      filmsWatched = filmCards.slice().filter((filmCard) => dayjs(filmCard.watchingDate).format('DD MM YYYY') === todayDate);
      break;
    case StatisticsRange.WEEK:
      filmsWatched = filmCards.slice().filter((filmCard) => dayjs(filmCard.watchingDate) > weekAgoDate && dayjs(filmCard.watchingDate) < currentDate);
      break;
    case StatisticsRange.MONTH:
      filmsWatched = filmCards.slice().filter((filmCard) => dayjs(filmCard.watchingDate) > monthAgoDate && dayjs(filmCard.watchingDate) < currentDate);
      break;
    case StatisticsRange.YEAR:
      filmsWatched = filmCards.slice().filter((filmCard) => dayjs(filmCard.watchingDate) > yearAgoDate && dayjs(filmCard.watchingDate) < currentDate);
      break;
  }
  return filmsWatched;
};

export { getDuration, getWatchedFilms, getGenresList, getMainGenre, getWatchedFilmsByRange };
