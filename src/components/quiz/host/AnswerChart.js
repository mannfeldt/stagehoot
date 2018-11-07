import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import CakeIcon from '@material-ui/icons/Cake';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';
import ExtensionIcon from '@material-ui/icons/ExtensionOutlined';
import StarIcon from '@material-ui/icons/StarBorder';

const answerStyles = [{
    icon: <CakeIcon />,
    color: '#EF9A9A',
},
{
    icon: <ExtensionIcon />,
    color: '#80DEEA'
},
{
    icon: <FavoriteIcon />,
    color: '#CE93D8'
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
        let topvalue = Math.max(...data.data);
        let cheatPixels = 10;
        let cheatValue = (topvalue * 100 / cheatPixels) / 100;
        chartData.datasets[0].borderColor = [];
        chartData.datasets[0].borderWidth = 2;
        for (let i = 0; i < data.data.length; i++) {
            chartData.datasets[0].data[i] = data.data[i] + cheatValue;
            chartData.labels.push("");
            chartData.datasets[0].backgroundColor.push(answerStyles[i].color);
        }

        return chartData;
    }
    getChartHeight() {
        let answerData = this.props.getAnswerData();
        let topvalue = Math.max(...answerData.data);
        if (topvalue >= 2) {
            return 300;
        }
        return topvalue * 100;
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
                        //optimer så jag inte behöver gör getanswedata arje fång?
                        let ctx = this.chart.ctx;
                        ctx.font = "24px Roboto";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "black";
                        ctx.textBaseline = "bottom";
                        let stepratio = animation.animationObject.currentStep / animation.animationObject.numSteps;
                        for (let i = 0; i < answerData.data.length; i++) {
                            let value = Math.floor(answerData.data[i] * stepratio);
                            let metadata = this.chart.config.data.datasets[0]._meta[0].data[i];

                            ctx.fillText(value, metadata._view.x, metadata._view.y - 2);

                        }
                    }

                    animation.animationObject.onAnimationComplete = function () {
                        //1. visa en ikon för rätt svar under rätt stapel. använd answerdata för att göra dett helt utanför chart. 
                        //2. fixa finare färger, ta bort border på rätt svar etc?
                        let ctx = this.chart.ctx;
                        for (let i = 0; i < answerData.data.length; i++) {
                            let metadata = this.chart.config.data.datasets[0]._meta[0].data[i];
                            ctx.beginPath();
                            ctx.fillStyle = "white";
                            ctx.rect(metadata._view.x - metadata._view.width / 2, this.chart.height - 27, metadata._view.width, 4);
                            ctx.fill();
                            if (answerData.correctAnswers.indexOf(i) > -1) {

                                let img = new Image();
                                img.src = "/baseline-done_outline-24px.svg";
                                img.height = 100;
                                img.width = 100;
                                img.color = "red";
                                let ypos = this.chart.height - 23;
                                img.onload = function () {
                                    ctx.drawImage(img, metadata._view.x - 12, ypos);
                                }
                            }
                        }
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
                    top: 20,
                    bottom: 0,
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