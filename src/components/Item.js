import React, { useContext } from "react";
import "./Item.css";
import { Context } from "./Context";
import { Draggable } from "react-beautiful-dnd";
import NaturalDragAnimation from "natural-drag-animation-rbdnd";

const Item = (props) => {
  const { item } = props;

  const { toggleItem, deleteItem } = useContext(Context);

  return (
    <Draggable draggableId={item.id} index={props.index}>
      {(provided, snapshot) => (
        <NaturalDragAnimation
          style={provided.draggableProps.style}
          snapshot={snapshot}
        >
          {(style) => (
            <div
              className="mb-2"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={style}
            >
              <li className="item-box shadow-sm bg-white">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={item.packed}
                    onChange={() => toggleItem(item)}
                    id={item.id}
                  />
                  <label className="form-check-label" htmlFor={item.id}>
                    {" "}
                    {item.value}
                  </label>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => deleteItem(item)}
                >
                  Remove
                </button>
              </li>
            </div>
          )}
        </NaturalDragAnimation>
      )}
    </Draggable>
  );
};

export default Item;
