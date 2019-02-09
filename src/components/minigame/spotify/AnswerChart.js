import React, { Component } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import {
  SPOTIFY_GREEN,
} from './SpotifyConstants';

const MAX_PLAYERS = 30;
const PLAYER_BAR_HEIGHT_INCREMENT = 22;
const MAX_HEIGHT_CHART = 700;

function getRawData(game) {
  const currentAnswers = Object.values(game.answers).filter(a => a.question === game.minigame.currentq);
  const players = Object.values(game.players);
  const answerPopulation = players.map((p) => {
    const popularity = {
      name: p.name,
      nr: currentAnswers.reduce((init, curr) => init + (curr.answer && curr.answer.includes(p.key) ? 1 : 0), 0),
    };
    return popularity;
  });

  answerPopulation.sort((a, b) => b.nr - a.nr);
  return answerPopulation;
}

class AnswerChart extends Component {
  constructor(props) {
    super(props);
    this.getChartData = this.getChartData.bind(this);
    this.getChartOptions = this.getChartOptions.bind(this);
    this.getChartHeight = this.getChartHeight.bind(this);
  }

  getChartData() {
    const { game } = this.props;

    const chartData = {
      labels: [],
      datasets: [{
        data: [],
        label: 'podium',
        backgroundColor: [],
        borderWidth: 1,
      }],
    };

    const answerPopulation = getRawData(game);
    const maxIndex = answerPopulation.length > MAX_PLAYERS ? MAX_PLAYERS : answerPopulation.length;
    for (let i = 0; i < maxIndex; i++) {
      chartData.labels.push(answerPopulation[i].name);
      chartData.datasets[0].data.push(answerPopulation[i].nr);
      chartData.datasets[0].backgroundColor.push(SPOTIFY_GREEN);
    }

    return chartData;
  }

  getChartHeight() {
    const chartData = this.getChartData();
    let height = 50 + (chartData.labels.length * PLAYER_BAR_HEIGHT_INCREMENT);
    if (height > MAX_HEIGHT_CHART) {
      height = MAX_HEIGHT_CHART;
    }
    return height;
  }

  getChartOptions() {
    const chartHeight = this.getChartHeight();
    const padding = (MAX_HEIGHT_CHART - chartHeight);
    const options = {
      maintainAspectRatio: false,
      showTooltips: false,
      responsiveAnimationDuration: 1000,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0,
            fontSize: 13,
            fontColor: 'rgba(255, 255, 255, 0.7)',
          },
          display: true,
          beginAtZero: true,
        }],
        xAxes: [{
          display: true,
          beginAtZero: true,
          ticks: {
            beginAtZero: true,
            min: 0,
            fontSize: 16,
            fontColor: 'rgba(255, 255, 255, 0.7)',
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      events: [],
      layout: {
        padding: {
          left: 15,
          right: 30,
          bottom: padding,
        },
      },
    };
    return options;
  }

  render() {
    const options = this.getChartOptions();
    return (
      <div style={{ maxHeight: MAX_HEIGHT_CHART }}>
        <HorizontalBar
          data={this.getChartData}
          height={MAX_HEIGHT_CHART}
          options={options}
        />
      </div>
    );
  }
}

export default AnswerChart;
