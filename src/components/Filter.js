import React, { Component } from "react";

class Filter extends Component {
  render() {
    const { searchTerm, onChange } = this.props;
    return (
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default Filter;
