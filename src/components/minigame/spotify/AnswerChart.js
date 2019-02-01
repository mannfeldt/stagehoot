import React, { Component } from 'react';
import { HorizontalBar } from 'react-chartjs-2';

const colors = ['#80DEEA', '#EF9A9A', '#CE93D8', '#C5E1A5'];
const MAX_PLAYERS = 10;
const PLAYER_BAR_HEIGHT_INCREMENT = 30;
const MAX_HEIGHT_CHART = 740;

function getRawData(game) {
  const currentAnswers = Object.values(game.answers).filter(a => a.question === game.minigame.currentq);
  const players = Object.values(game.players);
  const answerPopulation = players.map((p) => {
    const popularity = {
      name: p.name,
      nr: currentAnswers.reduce((init, curr) => init + (curr.answer.includes(p.key) ? 1 : 0), 0),
    };
    return popularity;
  });

  answerPopulation.sort((a, b) => b.nr - a.nr); // For ascending sort
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
      chartData.datasets[0].backgroundColor.push(colors[i % 4]);
    }

    return chartData;
  }

  getChartHeight() {
    const chartData = this.getChartData();
    let height = 70 + (chartData.labels.length * PLAYER_BAR_HEIGHT_INCREMENT);
    if (height > MAX_HEIGHT_CHART) {
      height = MAX_HEIGHT_CHART;
    }
    return height;
  }

  getChartOptions() {
    const chartHeight = this.getChartHeight();
    const padding = (MAX_HEIGHT_CHART - chartHeight) / 2;
    const options = {
      maintainAspectRatio: false,
      showTooltips: false,
      responsiveAnimationDuration: 1000,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          beginAtZero: true,
        }],
        xAxes: [{
          display: true,
          beginAtZero: true,
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
          left: 0,
          right: 60,
          top: padding,
          bottom: padding,
        },
      },
    };
    return options;
  }

  render() {
    return (
      <div style={{ maxHeight: MAX_HEIGHT_CHART }}>
        <HorizontalBar
          data={this.getChartData}
          height={MAX_HEIGHT_CHART}
          options={this.getChartOptions()}
        />
      </div>
    );
  }
}

export default AnswerChart;
