import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';


const styles = theme => ({
    card: {
        maxWidth: 400,
    },
});
class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    deleteQuestion() {
        this.props.deleteQuestion(this.props.question);
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    action={
                        <IconButton onClick={this.deleteQuestion}>
                            <DeleteIcon />
                        </IconButton>
                    }
                    title={this.props.question.question}
                    subheader={this.props.question.timelimit ? this.props.question.timelimit + ' seconds' : 'default timelimit'}
                />
                <CardContent>
                    <Typography variant="subtitle1" align="left">Correct answers</Typography>
                    <List>
                        {this.props.question.correctAnswers.map((answer, index) =>
                            <ListItem key={index}>
                                <ListItemText
                                    primary={answer}
                                />
                            </ListItem>
                        )}
                    </List>
                    <Typography variant="subtitle1" align="left">Wrong answers</Typography>
                    <List>
                        {this.props.question.wrongAnswers.map((answer, index) =>
                            <ListItem key={index}>
                                <ListItemText
                                    primary={answer}
                                />
                            </ListItem>
                        )}
                    </List>
                </CardContent>


            </Card>
        );
    }
}

export default withStyles(styles)(Question);