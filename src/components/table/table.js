import React, { Component } from "react";
import Button from "../button/button";
import { sortBy } from "lodash";
import classNames from "classnames";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import faSort from "@fortawesome/fontawesome-free-solid/faSort";
import faSortUp from "@fortawesome/fontawesome-free-solid/faSortUp";
import faSortDown from "@fortawesome/fontawesome-free-solid/faSortDown";

const largeColumn = {
  width: "40%"
};

const midColumn = {
  width: "30%"
};

const smallColumn = {
  width: "10%"
};

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title"),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, "num_comments"),
  POINTS: list => sortBy(list, "points")
};

const Sort = ({ sortKey, onSort, children, activeSortKey, isSortReverse }) => {
  const isCurrentKeyActive = sortKey === activeSortKey;
  const isCurrentKeySortReversed = isCurrentKeyActive && isSortReverse;

  const sortClass = classNames("button-inline", {
    "button-active": isCurrentKeyActive
  });

  let sortIcon;

  if (isCurrentKeySortReversed && isCurrentKeyActive){
    sortIcon = faSortDown;
  } else if (!isCurrentKeySortReversed && isCurrentKeyActive) {
    sortIcon = faSortUp;
  } else {
    sortIcon = faSort;
  }


  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
      <FontAwesomeIcon icon={sortIcon} />
    </Button>
  );
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: "NONE",
      isSortReverse: false
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: "40%" }}>
            <Sort
              sortKey={"TITLE"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Title
            </Sort>
          </span>
          <span style={{ width: "30%" }}>
            <Sort
              sortKey={"AUTHOR"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              sortKey={"COMMENTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Comments
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              sortKey={"POINTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: "10%" }}>Archive</span>
        </div>
        {reverseSortedList.map(item => (
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
  }
}

export default Table;
