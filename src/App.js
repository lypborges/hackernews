import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = 100;

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const Search = ({ searchTerm, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={searchTerm} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);

const largeColumn = {
  width: "40%"
};

const midColumn = {
  width: "30%"
};

const smallColumn = {
  width: "10%"
};

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map(item => (
      <div className="table-row" key={item.objectID}>
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.point}</span>
        <span style={smallColumn}>
          <Button
            onClick={() => {
              onDismiss(item.objectID);
            }}
          >
            Dismiss
          </Button>
        </span>
      </div>
    ))}
  </div>
);

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { result: null, searchTerm: DEFAULT_QUERY, error: null };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  onDismiss(id) {
    const updatedHits = this.state.result.hits.filter(
      item => item.objectID !== id
    );
    this.setState({ result: { ...this.state.result, hits: updatedHits } });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    event.preventDefault();
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  componentDidMount() {
    _isMounted = true;
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillDidUnmount(){
    _isMounted = false;
  }

  render() {
    const { result, searchTerm, error } = this.state;
    const page = (result && result.page) || 0;

    if (error) {
      return <p>Something went wrong.</p>;
    }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
          {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
        </div>
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
