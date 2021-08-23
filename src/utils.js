import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomFloat = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return (lower + Math.random() * (upper - lower)).toFixed(1);
};

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeDate = (date, format) => dayjs(date).format(format);

const humanizeCommentDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
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

export { getRandomFloat, getRandomInt, humanizeDate, humanizeCommentDate, getRandomText, truncateDescription, getRandomDate, getRandomEmotion, getRandomAuthor, checkIfActive };
