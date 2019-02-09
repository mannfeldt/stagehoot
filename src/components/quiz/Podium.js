import React, { Component } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { Typography } from '@material-ui/core';

const colors = ['#80DEEA', '#EF9A9A', '#CE93D8', '#C5E1A5'];
const MAX_PLAYERS = 20;
const PLAYER_BAR_HEIGHT_INCREMENT = 30;
const MAX_HEIGHT_PODIUM = 740;
class Podium extends Component {
  constructor(props) {
    super(props);
    this.getChartData = this.getChartData.bind(this);
    this.getChartOptions = this.getChartOptions.bind(this);
    this.getChartHeight = this.getChartHeight.bind(this);
  }

  getChartData() {
    const chartData = {
      labels: [],
      datasets: [{
        data: [],
        label: 'podium',
        backgroundColor: [],
        borderWidth: 1,
      }],
    };

    const playerKeys = this.props.game.players ? Object.keys(this.props.game.players) : [];
    const rawPlayerData = [];
    for (let i = 0; i < playerKeys.length; i++) {
      const playerScoreData = {};
      const player = this.props.game.players[playerKeys[i]];
      let score = 0;
      if (player.answers) {
        for (let j = 0; j < Object.keys(player.answers).length; j++) {
          const question = this.props.game.quiz.questions[j];
          const answer = player.answers[question.id];
          if (answer) {
            score += answer.score;
          }
        }
        playerScoreData.score = score;
        playerScoreData.name = player.name;
        rawPlayerData.push(playerScoreData);
      }
    }
    rawPlayerData.sort((a, b) => b.score - a.score); // For ascending sort
    const maxIndex = rawPlayerData.length > MAX_PLAYERS ? MAX_PLAYERS : rawPlayerData.length;
    for (let i = 0; i < maxIndex; i++) {
      chartData.labels.push(rawPlayerData[i].name);
      chartData.datasets[0].data.push(rawPlayerData[i].score);
      chartData.datasets[0].backgroundColor.push(colors[i % 4]);
    }

    return chartData;
  }

  getChartHeight() {
    const chartData = this.getChartData();
    let height = 70 + (chartData.labels.length * PLAYER_BAR_HEIGHT_INCREMENT);
    if (height > MAX_HEIGHT_PODIUM) {
      height = MAX_HEIGHT_PODIUM;
    }
    return height;
  }

  getChartOptions() {
    const chartHeight = this.getChartHeight();
    const padding = (MAX_HEIGHT_PODIUM - chartHeight) / 2;
    const options = {
      maintainAspectRatio: false,
      showTooltips: false,
      responsiveAnimationDuration: 1000,
      animation: {
        easing: 'easeInOutCubic',
        duration: '2000',
        onProgress(animation) {
          animation.animationObject.onAnimationProgress = function () {
            const ctx = this.chart.ctx;
            const chart = this.chart;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.font = '20px Roboto';

            const stepratio = animation.animationObject.currentStep / animation.animationObject.numSteps;
            const meta = chart.getDatasetMeta(0);
            if (!meta.hidden) {
              meta.data.forEach((element, index) => {
                // Draw the text in black, with the specified font

                // Just naively convert to string for now
                const dataString = Math.floor(chart.data.datasets[0].data[index] * stepratio).toString();
                ctx.fillStyle = colors[index % 4];

                const position = element.tooltipPosition();
                ctx.fillText(dataString, position.x + 2 + (dataString.length * 6), position.y + (element._model.height / 2));
              });
            }
          };
        },
      },
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

  getWinnerString() {
    return 'Congratulations [name of player]! ';
  }

  render() {
    return (
      <div style={{ maxHeight: MAX_HEIGHT_PODIUM }}>
        <HorizontalBar
          data={this.getChartData}
          height={MAX_HEIGHT_PODIUM}
          options={this.getChartOptions()}
        />
        <Typography variant="subtitle1">{this.getWinnerString()}</Typography>
      </div>
    );
  }
}

export default Podium;
