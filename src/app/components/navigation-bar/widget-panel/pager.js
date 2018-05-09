import React, { Component } from 'react';

const styles = {
  table: {
    display: 'table'
  },
  tableRow: {
    display: 'table-row'
  },
  tableCell: {
    display: 'table-cell',
    verticalAlign: 'middle',
    lineHeight: '1'
  },
  navButton: {
    cursor: 'pointer',
    fontSize: '30px'
  },
  container: {
    textAlign: 'center',
    userSelect: 'none',
    margin: '0 10px'
  },
};

const pageSize = 10;

export default class EntitiesPager extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={{display: 'inline-block', verticalAlign: 'bottom', marginRight: '10px'}}>
          <div style={styles.table}>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onFirstPageButtonClick.bind(this)}>first_page</i>
            </div>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onPrevPageButtonClick.bind(this)}>chevron_left</i>
            </div>
            <div style={{...styles.tableCell, fontSize: '20px', fontWeight: 'normal', paddingBottom: '5px'}}>
              {this.props.page.number + 1} of {Math.max(this.props.page.totalPages, 1)}
            </div>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onNextPageButtonClick.bind(this)}>chevron_right</i>
            </div>
            <div style={styles.tableCell}>
              <i style={styles.navButton} className="material-icons" onClick={this.onLastPageButtonClick.bind(this)}>last_page</i>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onFirstPageButtonClick() {
    if (this.props.page.number === 0) {
      return;
    }

    this.props.onPagerChange(0, this.props.size || pageSize);
  }

  onPrevPageButtonClick() {
    if (this.props.page.number === 0) {
      return;
    }

    this.props.onPagerChange(this.props.page.number - 1, this.props.size || pageSize);
  }

  onNextPageButtonClick() {
    if (this.props.page.number >= this.props.page.totalPages - 1) {
      return;
    }

    this.props.onPagerChange(this.props.page.number + 1, this.props.size || pageSize);
  }

  onLastPageButtonClick() {
    if (this.props.page.number >= this.props.page.totalPages - 1) {
      return;
    }

    this.props.onPagerChange(this.props.page.totalPages - 1, this.props.size || pageSize);
  }
}