import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Typography } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import Question from './Question';
import QuestionForm from './QuestionForm';
import { calculateDefaultTimeLimit } from '../../common/utils/appUtil';


class CreateQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      gametype: 'quiz',
      gamemode: 'normal',
      timelimit: true,
      timescore: false,
      questions: [],
      gamePass: '',
    };
    this.addQuestion = this.addQuestion.bind(this);
    this.addQuestions = this.addQuestions.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.createQuiz = this.createQuiz.bind(this);
  }

    handleChange = name => (event) => {
      this.setState({
        [name]: event.target.value,
      });
    };

    handleChangeBool = name => (event) => {
      this.setState({ [name]: event.target.checked });
    };

    handleChangeSelect = (event) => {
      this.setState({ [event.target.name]: event.target.value });
    };

    addQuestion(q) {
      const { questions, timelimit } = this.state;
      const { showSnackbar } = this.props;
      const question = q;
      if (questions.length === 0) {
        question.id = 1;
      } else {
        // räknar ut ett id som det nuvarande högsta id+1. Kan då använda id både som unik identifierare och som index
        question.id = Math.max(...questions.map(o => o.id)) + 1;
      }
      if (timelimit && !question.timelimit) {
        question.timelimit = calculateDefaultTimeLimit(question);
      }
      questions.push(question);
      this.setState({
        questions,
      });
      const snack = {
        variant: 'success',
        message: 'Added question',
      };
      showSnackbar(snack);
    }

    addQuestions(qs) {
      const { questions, timelimit } = this.state;
      const { showSnackbar } = this.props;
      for (let i = 0; i < qs.length; i++) {
        const question = qs[i];
        if (questions.length === 0) {
          question.id = 1;
        } else {
          question.id = Math.max(...questions.map(o => o.id)) + 1;
        }
        if (timelimit && !question.timelimit) {
          question.timelimit = calculateDefaultTimeLimit(question);
        }
        questions.push(question);
      }
      this.setState({
        questions,
      });
      const snack = {
        variant: 'success',
        message: 'Added questions',
      };
      showSnackbar(snack);
    }

    deleteQuestion(question) {
      const { questions } = this.state;
      const index = questions.map(e => e.id).indexOf(question.id);
      questions.splice(index, 1);
      this.setState({
        questions,
      });
    }

    createQuiz() {
      const { createQuiz } = this.props;
      const {
        timelimit, gamePass, gametype, title, timescore, questions,
      } = this.state;
      const game = {
        password: gamePass,
        gametype,
        tile: title,
        quiz: {
          gamemode: 'normal',
          timelimit,
          timescore,
          questions,
        },
      };
      createQuiz(game);
    }

    render() {
      const {
        timelimit, gamePass, title, timescore, gamemode, questions,
      } = this.state;
      const { showSnackbar } = this.props;
      return (
        <div className="app-page create-page">
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="h4">New quiz</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <form autoComplete="off">
                <Grid item xs={12}>

                  <FormControl required fullWidth>
                    <InputLabel htmlFor="gametype-required">Gamemode</InputLabel>
                    <Select
                      value={gamemode || ''}
                      onChange={this.handleChangeSelect}
                      name="gamemode"
                      inputProps={{
                        id: 'gamemode-required',
                      }}
                    >
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="wild">Wild</MenuItem>

                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>

                  <FormControl component="fieldset">
                    <FormLabel component="legend">Game options</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={(
                          <Switch
                            checked={timelimit}
                            onChange={this.handleChangeBool('timelimit')}
                            value="timelimit"
                          />
)}
                        label="Time limited questions"
                      />
                      <FormControlLabel
                        control={(
                          <Switch
                            checked={timescore}
                            onChange={this.handleChangeBool('timescore')}
                            value="timescore"
                          />
)}
                        label="Time based score"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>

                  <FormControl>
                    <TextField
                      label="Title"
                      name="title"
                      value={title}
                      margin="normal"
                      onChange={this.handleChange('title')}
                    />
                  </FormControl>
                  <FormControl>
                    <TextField
                      label="Password"
                      type="password"
                      name="gamePass"
                      margin="normal"
                      value={gamePass}
                      onChange={this.handleChange('gamePass')}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button onClick={this.createQuiz} variant="contained">Create quiz</Button>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12} md={6}>
              <QuestionForm addQuestions={this.addQuestions} addQuestion={this.addQuestion} isTimelimit={!!timelimit} showSnackbar={showSnackbar} />
            </Grid>
            <Grid container>
              {questions.map((question, index) => (
                <Grid item xs={12} md={6} key={question.id}>
                  <Question question={question} transitionDelay={index} deleteQuestion={this.deleteQuestion} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
      );
    }
}
CreateQuiz.propTypes = {
  showSnackbar: PropTypes.func.isRequired,
  createQuiz: PropTypes.func.isRequired,
};
export default CreateQuiz;
