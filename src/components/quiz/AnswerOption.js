import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CakeIcon from '@material-ui/icons/Cake';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder';
import ExtensionIcon from '@material-ui/icons/ExtensionOutlined';
import StarIcon from '@material-ui/icons/StarBorder';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
  },
  playAnswer: {
    width: '50vw',
    height: '100%',
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  icon: {
    float: 'left',
    fontSize: '28',
    color: 'white',
    marginLeft: '10px',
  },
  answer: {
    fontSize: 18,
    fontWeight: 500,
    color: 'white',
  },
});

const answerStyles = [{
  icon: <CakeIcon />,
  color: '#73c7d2',
},
{
  icon: <ExtensionIcon />,
  color: '#d78a8a',
},
{
  icon: <FavoriteIcon />,
  color: '#b984c2',
},
{
  icon: <StarIcon />,
  color: '#b1ca94',
}];

class AnswerOption extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    /*
                        på play answer vill jag inte skriva texten utan bara ha rätt färg + symbol. play answer ska vara större. men det kanske jag kan fixa via cssklass i playanswer.
                        på host answer har jag rätt färg symbol + text

                        symboler icons: hjärta,stjärna,blomma (filter_vintage), berg, pusselbit(extension), cloud
                        trekant, fyrkant, cirkel,
                        1,2,3,4 (finns som icon)
                        a,b,c,d (finns inte om icon)
                        välj 4 coola färger, grön röd blå gul?
                        tänk på att det kan vara två alternativ
        */
  }

  render() {
    const design = answerStyles[this.props.index];
    const { classes } = this.props;

    return (
      <div className="full-height">
        {this.props.answerQuestion && (
        <Paper onClick={() => { this.props.answerQuestion(this.props.answer); }} className={classes.playAnswer} style={{ backgroundColor: design.color }}>
          <div className="button-answer-icon">{design.icon}</div>
          {this.props.remoteMode && <div className={classes.answer}>{this.props.answer}</div>}
        </Paper>
        )
                }
        {!this.props.answerQuestion && (
        <Paper className={classes.paper} style={{ backgroundColor: design.color }}>
          <div className={classes.icon}>{design.icon}</div>
          <div className={classes.answer}>{this.props.answer}</div>
        </Paper>
        )
                }
      </div>
    );
  }
}

export default withStyles(styles)(AnswerOption);
