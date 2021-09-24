import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import { StatisticsRange } from '../const.js';
import { getUserRating} from '../utils/film.js';
import { getDuration, getGenresList, getMainGenre } from '../utils/statistics.js';

const renderChart = (statisticCtx, filmCards) => {
  const totalGenres = getGenresList(filmCards);
  const genres = totalGenres.genres;
  const quantity = totalGenres.quantity;
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * genres.length;

  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: quantity,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsContentTemplate = (filmCards, range) => {
  const userRating = getUserRating(filmCards);
  const amountWatchedFilms = filmCards.length;
  let durationFilms = 0;
  filmCards.forEach((filmCard) => durationFilms += filmCard.runtime);
  const titalDuration = getDuration(durationFilms);
  const totalHours = titalDuration.hours;
  const totalMinutes = titalDuration.minutes;
  const mainGanre = getMainGenre(filmCards);

  return `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRating}</span>
      </p>
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${range === StatisticsRange.ALL ? 'checked' : ''}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${range === StatisticsRange.TODAY ? 'checked' : ''}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${range === StatisticsRange.WEEK ? 'checked' : ''}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${range === StatisticsRange.MONTH ? 'checked' : ''}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${range === StatisticsRange.YEAR ? 'checked' : ''}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${amountWatchedFilms} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${mainGanre}</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`;
};

export default class StatsContent extends SmartView {
  constructor(filmCards, filmRange) {
    super();
    this._filmCards = filmCards;
    this._filmRange = filmRange;
    this._chart = null;
    this._clickStatsHandler = this._clickStatsHandler.bind(this);
    this._setStatsCharts();
  }

  getTemplate() {
    return createStatsContentTemplate(this._filmCards, this._filmRange);
  }

  _clickStatsHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._setStatsCharts();
    this._callback.statsChange(evt.target.value);
  }

  _setStatsCharts() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const chart = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(chart, this._filmCards);
  }

  setStatsChangeHandler(callback) {
    this._callback.statsChange = callback;
    this.getElement().addEventListener('click', this._clickStatsHandler);
  }
}
