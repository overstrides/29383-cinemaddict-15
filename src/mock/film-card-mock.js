import { nanoid } from 'nanoid';
import { MIN_STRINGS_DESCRIPTION, MAX_STRINGS_DESCRIPTION, MIN_FILM_RATING, MAX_FILM_RATING, TEXT_SOURCE, FILM_WATCH_MAX_RANGE } from '../const.js';
import { getRandomFloat, getRandomInt } from '../utils/common.js';
import { humanizeDate, getRandomText, getRandomDate } from '../utils/film.js';

const generateFilmCardData = () => {
  const filmCardData = [
    {
      title: 'The Dance of Life',
      poster: 'the-dance-of-life.jpg',
      ageRating: 18,
      directors: ['John Cromwell', 'A. Edward Sutherland'],
      writers: ['Benjamin Glazer', 'Arthur Hopkins', 'Julian Johnson'],
      actors: ['Hal Skelly', 'Nancy Carroll', 'Dorothy Revier'],
      releaseDate: '28 August 1929',
      releaseCountry: 'USA',
      runtime: 115,
      genres: ['Musical', 'Film-Noir', 'Mystery'],
    },
    {
      title: 'Sagebrush Trail',
      poster: 'sagebrush-trail.jpg',
      ageRating: 16,
      directors: ['Armand Schaefer'],
      writers: ['Lindsley Parsons'],
      actors: ['John Wayne', 'Nancy Shubert', 'Lane Chandler'],
      releaseDate: '15 December 1933',
      releaseCountry: 'USA',
      runtime: 54,
      genres: ['Western', 'Action', 'Drama', 'Romance'],
    },
    {
      title: 'The Man with the Golden Arm',
      poster: 'the-man-with-the-golden-arm.jpg',
      ageRating: 16,
      directors: ['Otto Preminger'],
      writers: ['Walter Newman', 'Lewis Meltzer'],
      actors: ['Frank Sinatra', 'Kim Novak', 'Eleanor Parker'],
      releaseDate: '15 December 1955',
      releaseCountry: 'USA',
      runtime: 119,
      genres: ['Drama', 'Crime', 'Romance'],
    },
    {
      title: 'Santa Claus Conquers the Martians',
      poster: 'santa-claus-conquers-the-martians.jpg',
      ageRating: 8,
      directors: ['Nicholas Webster'],
      writers: ['Glenville Mareth', 'Paul L. Jacobson'],
      actors: ['John Call', 'Leonard Hicks', 'Vincent Beck'],
      releaseDate: '14 November 1964',
      releaseCountry: 'USA',
      runtime: 81,
      genres: ['Comedy', 'Adventure', 'Family'],
    },
    {
      title: 'Popeye the Sailor Meets Sindbad the Sailor',
      poster: 'popeye-meets-sinbad.png',
      ageRating: 8,
      directors: ['Dave Fleischer'],
      writers: ['Max Fleischer', 'Adolph Zukor'],
      actors: ['Jack Mercer', 'Mae Questel', 'Gus Wickie', 'Lou Fleischer'],
      releaseDate: '27 November 1936',
      releaseCountry: 'USA',
      runtime: 16,
      genres: ['Cartoon', 'Comedy', 'Family'],
    },
    {
      title: 'The Great Flamarion',
      poster: 'the-great-flamarion.jpg',
      ageRating: 18,
      directors: ['Anthony Mann'],
      writers: ['Anne Wigton', 'Heinz Herald', 'Richard Weil'],
      actors: ['Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea'],
      releaseDate: '30 March 1945',
      releaseCountry: 'USA',
      runtime: 78,
      genres: ['Mystery', 'Drama', 'Film-Noir', 'Romance'],
    },
    {
      title: 'Made for Each Other',
      poster: 'made-for-each-other.png',
      ageRating: 16,
      directors: ['John Cromwell'],
      writers: ['Jo Swerling', 'Rose Franken'],
      actors: ['Carole Lombard', 'James Stewart', 'Charles Coburn'],
      releaseDate: '10 February 1939',
      releaseCountry: 'USA',
      runtime: 92,
      genres: ['Comedy', 'Drama', 'Romance'],
    },
  ];

  const filmCardIndex = getRandomInt(0, filmCardData.length - 1);
  return filmCardData[filmCardIndex];
};

export const generateFilmCard = (commentsId) => {
  const filmCardData = generateFilmCardData();
  const isWatchedFilm = Boolean(getRandomInt(0, 1));

  return {
    id: nanoid(),
    title: filmCardData.title,
    alternativeTitle: filmCardData.title,
    totalRating: getRandomFloat(MIN_FILM_RATING, MAX_FILM_RATING),
    poster: `./images/posters/${filmCardData.poster}`,
    ageRating: filmCardData.ageRating,
    directors: filmCardData.directors,
    writers: filmCardData.writers,
    actors: filmCardData.actors,
    release: {
      date: humanizeDate(filmCardData.releaseDate, 'D MMMM YYYY'),
      country: filmCardData.releaseCountry,
    },
    runtime: filmCardData.runtime,
    genres: filmCardData.genres,
    description: getRandomText(TEXT_SOURCE, MIN_STRINGS_DESCRIPTION, MAX_STRINGS_DESCRIPTION),
    isInWatchlist: Boolean(getRandomInt(0, 1)),
    isWatched: isWatchedFilm,
    watchingDate: isWatchedFilm ? getRandomDate(FILM_WATCH_MAX_RANGE) : '',
    isInFavorite: Boolean(getRandomInt(0, 1)),
    commentsId: commentsId,
  };
};
