import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import CakeIcon from '@material-ui/icons/Cake';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';
import ExtensionIcon from '@material-ui/icons/ExtensionOutlined';
import StarIcon from '@material-ui/icons/StarBorder';
const PUBLIC_PATH = process.env.PUBLIC_URL;

const answerStyles = [{
    icon: <CakeIcon />,
    color: '#80DEEA',
},
{
    icon: <ExtensionIcon />,
    color: '#EF9A9A',
},
{
    icon: <FavoriteIcon />,
    color: '#CE93D8',
},
{
    icon: <StarIcon />,
    color: '#C5E1A5'
}];

class AnswerChart extends Component {
    constructor(props) {
        super(props);
        this.getChartData = this.getChartData.bind(this);
        this.getChartOptions = this.getChartOptions.bind(this);
        this.getChartHeight = this.getChartHeight.bind(this);

    }
    getChartData() {
        let chartData = {
            labels: [],
            datasets: [{
                data: [],
                label: 'asdf',
                backgroundColor: [],
                borderWidth: 1,
            }]
        };
        let data = this.props.getAnswerData();
        chartData.datasets[0].borderColor = [];
        chartData.datasets[0].data = data.data;
        for (let i = 0; i < data.data.length; i++) {
            chartData.labels.push("");
            chartData.datasets[0].backgroundColor.push(answerStyles[i].color);
        }

        return chartData;
    }
    getChartHeight() {
        let answerData = this.props.getAnswerData();
        let topvalue = Math.max(...answerData.data);
        let incrementHeightPerAnswer = 25;
        //räcker 65?
        let minHeight = 65;
        let maxHeight = 300;
        let height = minHeight + (topvalue * incrementHeightPerAnswer);
        if (height > maxHeight) {
            return maxHeight;
        }
        return height;
    }

    getChartOptions() {
        let that = this;
        let options = {
            maintainAspectRatio: false,
            showTooltips: false,
            responsiveAnimationDuration: 1000,
            animation: {
                easing: 'easeInOutCubic',
                duration: '2000',
                onProgress: function (animation) {
                    let answerData = that.props.getAnswerData();
                    animation.animationObject.onAnimationProgress = function () {
                        let ctx = this.chart.ctx;
                        let chart = this.chart;
                        ctx.textAlign = "center";
                        ctx.fillStyle = "black";
                        ctx.textBaseline = "bottom";
                        ctx.font = "24px Roboto";

                        let stepratio = animation.animationObject.currentStep / animation.animationObject.numSteps;

                        let meta = chart.getDatasetMeta(0);
                        if (!meta.hidden) {
                            meta.data.forEach(function (element, index) {
                                // Draw the text in black, with the specified font

                                // Just naively convert to string for now
                                let dataString = Math.floor(chart.data.datasets[0].data[index] * stepratio);

                                let position = element.tooltipPosition();
                                ctx.fillStyle = answerStyles[index].color;
                                ctx.fillText(dataString, position.x, position.y - 2);
                                ctx.beginPath();
                                ctx.rect(position.x - element._view.width / 2, chart.height - 32, element._view.width, 22);
                                ctx.fill();
                                if (answerData.correctAnswers.indexOf(index) > -1) {

                                    let img = new Image();
                                    img.src = PUBLIC_PATH +"/baseline-done_outline-24px.svg";
                                    img.height = 100;
                                    img.width = 100;
                                    let ypos = chart.height - 34;
                                    //ta bort onlead wrapper för att göra det instant
                                    ctx.drawImage(img, position.x - 12, ypos);

                                }
                            });
                        }








                        /*
                                                for (let i = 0; i < answerData.data.length; i++) {
                                                    let value = Math.floor(answerData.data[i] * stepratio);
                                                    //om det inte är någon som svarar så blir meta[0] undefined första gången. går jag in på nytt på gamet som host så fungerar det
                                                    //ha någon specifik hantering för om ingen har svarat alls
                                                    var meta = this.chart.getDatasetMeta(0);
                                                    let metadata = meta.data[i];
                        
                                                    ctx.fillStyle = answerStyles[i].color;
                                                    ctx.fillText(value, metadata._view.x, metadata._view.y - 2);
                                                    ctx.beginPath();
                                                    ctx.rect(metadata._view.x - metadata._view.width / 2, this.chart.height - 32, metadata._view.width, 22);
                                                    ctx.fill();
                                                    if (answerData.correctAnswers.indexOf(i) > -1) {
                        
                                                        let img = new Image();
                                                        img.src = "/baseline-done_outline-24px.svg";
                                                        img.height = 100;
                                                        img.width = 100;
                                                        let ypos = this.chart.height - 34;
                                                        //ta bort onlead wrapper för att göra det instant
                                                        ctx.drawImage(img, metadata._view.x - 12, ypos);
                        
                                                    }
                                                }
                        
                                                */
                    }


                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    display: false,
                    beginAtZero: true,
                }],
                xAxes: [{
                    display: false,
                }]
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false
            },
            events: [],
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 25,
                    bottom: 40,
                }
            }
        }
        return options;
    }

    render() {

        return (
            <Bar data={this.getChartData} height={this.getChartHeight()}
                options={this.getChartOptions()} />
        );
    }
}

export default AnswerChart;