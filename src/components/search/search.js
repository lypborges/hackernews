import React, { Component } from "react";

class Search extends Component {
  componentDidMount() {
    if (this.inputSearch) {
      this.inputSearch.focus();
    }
  }

  render() {
    const { searchTerm, onChange, onSubmit, children } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={onChange}
          ref={node => {
            this.inputSearch = node;
          }}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}

export default Search;
