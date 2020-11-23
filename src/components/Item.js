import React, { useContext } from "react";
import "./Item.css";
import { Context } from "./Context";

const Item = (props) => {
  const { item } = props;
  console.log("Rendered");
  const { toggleItem, deleteItem } = useContext(Context);

  return (
    <>
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
    </>
  );
};

export default Item;
