import React, { useContext } from "react";
import "./Item.css";
import { Context } from "./Context";
import { Draggable } from "react-beautiful-dnd";

const Item = (props) => {
  const { item } = props;
  //console.log("Rendered", item);
  const { toggleItem, deleteItem } = useContext(Context);
  console.log("out", props);
  return (
    <Draggable draggableId={item.id} index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
        </div>
      )}
    </Draggable>
  );
};

export default Item;
