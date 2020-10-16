import React, { PureComponent } from "react";
import "./Item.css";
import { AppContext } from "../App";

class Item extends PureComponent {
  render() {
    const { item } = this.props;
    console.log("Rendered");

    return (
      <AppContext.Consumer>
        {({ toggleItem, deleteItem }) => (
          <li className="item-box">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={item.packed}
                onChange={() => toggleItem(item.id)}
                id={item.id}
              />
              <label className="form-check-label" htmlFor={item.id}>
                {" "}
                {item.value}
              </label>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => deleteItem(item.id)}
            >
              Remove
            </button>
          </li>
        )}
      </AppContext.Consumer>
    );
  }
}

export default Item;
