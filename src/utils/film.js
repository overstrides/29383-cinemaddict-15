import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getRandomInt } from './common.js';

const getUserRating = (filmsCards) => {
  let userTitle = '';
  let userFilmsWatched = 0;

  filmsCards.forEach((filmCard) => {
    if (filmCard.isWatched) {
      userFilmsWatched += 1;
    }
  });

  if (userFilmsWatched > 0 && userFilmsWatched <= 10) {
    userTitle = 'Novice';
  } else if (userFilmsWatched > 10 && userFilmsWatched < 20) {
    userTitle = 'Fan';
  } else if (userFilmsWatched > 20) {
    userTitle = 'Movie Buff';
  } else {
    userTitle = '';
  }

  return userTitle;
};

const humanizeDate = (date, format) => dayjs(date).format(format);

const humanizeCommentDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

const getFilmDuration = (minutes) => {
  const durationInHours = Math.trunc(minutes / 60) > 0 ? `${Math.trunc(minutes / 60)}h` : '';
  const durationInMinutes = minutes && minutes % 60 !== 0 ? `${minutes % 60}m` : '';
  const durationSeparator = durationInHours && durationInMinutes ? ' ' : '';
  const filmDuration = durationInHours || durationInMinutes ? durationInHours + durationSeparator + durationInMinutes : '';
  return filmDuration;
};

const truncateDescription = (description, length) => {
  const truncatedDescription = description.length > length ? `${description.slice(0, length - 1)}…` : description;
  return truncatedDescription;
};

const getRandomDate = (range) => {
  const date = dayjs()
    .add(getRandomInt(-range, 0), 'day')
    .toDate();
  return date;
};

const getRandomEmotion = (emotions) => {
  const randomEmotion = `./images/emoji/${emotions[getRandomInt(0, emotions.length - 1)]}`;
  return randomEmotion;
};

const getRandomAuthor = (authors) => {
  const randomAuthor = authors[getRandomInt(0, authors.length - 1)];
  return randomAuthor;
};

const getRandomText = (text, min, max) => {
  const numberOfStrings = getRandomInt(min, max);
  let randomText = '';

  for (let i = 0; i < numberOfStrings; i++) {
    const randomTextIndex = getRandomInt(0, text.length - 1);
    randomText += text[randomTextIndex];
  }

  return randomText;
};

const checkIfActive = (element, activeClass) => element ? activeClass : '';

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

const sortByDate = (filmA, filmB) => dayjs(filmA.release.date) - dayjs(filmB.release.date);

const sortByRating = (filmA, filmB) => filmB.totalRating - filmA.totalRating;

const getDate = () => {
  dayjs.extend(relativeTime);
  const date = dayjs().toDate();

  return dayjs(date).fromNow();
};

export { getUserRating, humanizeDate, humanizeCommentDate, getFilmDuration, getRandomText, truncateDescription, getRandomDate, getRandomEmotion, getRandomAuthor, checkIfActive, getFilmDetailsData, sortByDate, sortByRating, getDate };
