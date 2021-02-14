import React from 'react';
import ReactDOM from 'react-dom';
const _ = require('lodash');

// Blackbox start
const getRandomString = () => Math.random().toString(36).substring(2, 15);

const getRandomNumberLessThan = (max) => Math.floor(Math.random() * max);

const makeServerCall = (searchText) => {
  console.log(`Making server call for - ${searchText}`);
  let results = [];

  if (searchText) {
    for (let i = 0; i < 2 + getRandomNumberLessThan(5); i++) {
      results.push(`${searchText} - ${getRandomString()}`);
    }
  }

  return new Promise((resolve, reject) => {
    window.setTimeout(
      () => resolve({ searchText, results }),
      1000 * Math.random()
    );
  });
};
// Blackbox end

export default class App extends React.Component {
  constructor(args) {
    super(args);
    this.state = {
      searchText: '',
      suggestions: [],
    };
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
    this.fetchSuggestions = this.fetchSuggestions.bind(this);
    this.cachedSearchText = '';
    this.debouncedFetchSuggestions = _.debounce(this.fetchSuggestions, 500);
  }

  onSearchTextChange(event) {
    const searchText = event.target.value;
    this.setState({ searchText });
    this.cachedSearchText = searchText;

    this.debouncedFetchSuggestions(searchText);
  }

  fetchSuggestions(searchText) {
    makeServerCall(searchText).then((res) => {
      if (this.cachedSearchText === res.searchText) {
        this.setState({ suggestions: res.results });
      }
    });
  }

  render() {
    return (
      <div class='inputcontainer'>
        <input class='input' onChange={this.onSearchTextChange} />
        <ul class='list'>
          {this.state.suggestions.map((suggestion) => (
            <li class='listItem'> {suggestion}</li>
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
