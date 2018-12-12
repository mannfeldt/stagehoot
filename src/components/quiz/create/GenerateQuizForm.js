import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import { parseDOM, parseDOMArray } from '../../common/utils/appUtil';


class GenerateQuizForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nrOfQuestions: '10',
      category: '0',
      difficulty: '0',
      aType: '0',

    };
    this.generateQuestions = this.generateQuestions.bind(this);
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeSelect = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  generateQuestions() {
    const {
      nrOfQuestions, category, difficulty, aType,
    } = this.state;
    const { addQuestions, showSnackbar } = this.props;
    let url = 'https://opentdb.com/api.php?';
    if (nrOfQuestions !== '0') {
      url += `amount=${nrOfQuestions}`;
    }
    if (category !== '0') {
      url += `&category=${category}`;
    }
    if (difficulty !== '0') {
      url += `&difficulty=${difficulty}`;
    }
    if (aType !== '0') {
      url += `&type=${aType}`;
    }
    fetch(url)
      .then(response => response.json())
      .then((generated) => {
        if (generated.response_code === 0) {
          const questions = [];
          for (let i = 0; i < generated.results.length; i++) {
            const generatedQuestion = generated.results[i];
            const question = {
              question: parseDOM(generatedQuestion.question),
              correctAnswers: [parseDOM(generatedQuestion.correct_answer)],
              wrongAnswers: parseDOMArray(generatedQuestion.incorrect_answers),
              qType: 'text',
              aType: generatedQuestion.type,
              category: generatedQuestion.category,
              difficulty: generatedQuestion.difficulty,
            };
            questions.push(question);
          }
          addQuestions(questions);
        } else {
          const snack = {
            variant: 'error',
            message: `Could not generate questions( code: ${generated.response_code})`,
          };
          showSnackbar(snack);
        }
      });
  }


  render() {
    const {
      nrOfQuestions, category, difficulty, aType,
    } = this.state;
    return (
      <div>
        <Grid container>
          <Grid item xs={12} md={6}>

            <FormControl fullWidth>
              <TextField
                label="Number of questions"
                name="nrOfQuestions"
                value={nrOfQuestions}
                margin="normal"
                onChange={this.handleChange('nrOfQuestions')}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>

            <FormControl fullWidth>
              <InputLabel htmlFor="category">Category</InputLabel>
              <Select
                value={category || ''}
                onChange={this.handleChangeSelect}
                name="category"
                inputProps={{
                  id: 'category',
                }}
              >
                <MenuItem value="0">Any category</MenuItem>
                <MenuItem value="9">General Knowledge</MenuItem>
                <MenuItem value="10">Entertainment: Books</MenuItem>
                <MenuItem value="11">Entertainment: Film</MenuItem>
                <MenuItem value="12">Entertainment: Music</MenuItem>
                <MenuItem value="13">Entertainment: Musicals and Theatres</MenuItem>
                <MenuItem value="14">Entertainment: Television</MenuItem>
                <MenuItem value="15">Entertainment: Video Games</MenuItem>
                <MenuItem value="16">Entertainment: Board Games</MenuItem>
                <MenuItem value="17">Science and Nature</MenuItem>
                <MenuItem value="18">Science: Computers</MenuItem>
                <MenuItem value="19">Science: Mathematics</MenuItem>
                <MenuItem value="20">Mythology</MenuItem>
                <MenuItem value="21">Sports</MenuItem>
                <MenuItem value="22">Geography</MenuItem>
                <MenuItem value="23">History</MenuItem>
                <MenuItem value="24">Politics</MenuItem>
                <MenuItem value="25">Art</MenuItem>
                <MenuItem value="26">Celebrities</MenuItem>
                <MenuItem value="27">Animals</MenuItem>
                <MenuItem value="28">Vehicles</MenuItem>
                <MenuItem value="29">Entertainment: Comics</MenuItem>
                <MenuItem value="30">Science: Gadgets</MenuItem>
                <MenuItem value="31">Entertainment: Japanese Anime and Manga</MenuItem>
                <MenuItem value="32">Entertainment: Cartoon and Animations</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>

            <FormControl fullWidth>
              <InputLabel htmlFor="difficulty">Difficulty</InputLabel>
              <Select
                value={difficulty || ''}
                onChange={this.handleChangeSelect}
                name="difficulty"
                inputProps={{
                  id: 'difficulty',
                }}
              >
                <MenuItem value="0">Any difficulty</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>

            <FormControl fullWidth>
              <InputLabel htmlFor="aType">Answer type</InputLabel>
              <Select
                value={aType || ''}
                onChange={this.handleChangeSelect}
                name="aType"
                inputProps={{
                  id: 'aType',
                }}
              >
                <MenuItem value="0">Any type</MenuItem>
                <MenuItem value="multiple">Multiple choice</MenuItem>
                <MenuItem value="boolean">True/False</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>

            <Button onClick={this.generateQuestions} variant="contained">Generate</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
GenerateQuizForm.propTypes = {
  addQuestions: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
};
export default GenerateQuizForm;
