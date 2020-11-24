import React, { useState, useEffect } from "react";
import { generate as id } from "shortid";
import NewItem from "./components/NewItem";
import ListItems from "./components/ListItems";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "./components/Context";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

const App = () => {
  const [items, setItems] = useState(
    reactLocalStorage.getObject("items").length
      ? reactLocalStorage.getObject("items")
      : []
  );
  useEffect(() => {
    reactLocalStorage.setObject("items", items);
  }, [items]);
  console.log("items", items);

  const addItem = (value) => {
    setItems([{ id: id(), value, packed: false }, ...items]);
  };

  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const makeAllUnpacked = () => {
    setItems(
      items.map((item) => (item.packed ? { ...item, packed: false } : item))
    );
  };

  const provider = {
    items,
    deleteItem,
    toggleItem,
  };
  const onDragEnd = (result) => {
    console.log("onDragEnd", result);
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceItems = [...items];
    const [removed] = sourceItems.splice(source.index, 1);
    sourceItems.splice(destination.index, 0, removed);
    setItems(sourceItems);
  };

  const packedItems = items.filter ? items.filter((item) => item.packed) : [];
  const unPackedItems = items.filter
    ? items.filter((item) => !item.packed)
    : [];

  return (
    <DragDropContext
      // onBeforeCapture={onBeforeCapture}
      // onBeforeDragStart={onBeforeDragStart}
      //onDragStart={onDragStart}
      //onDragUpdate={onDragUpdate}
      onDragEnd={(result) => onDragEnd(result)}
    >
      <Context.Provider value={provider}>
        <div className="container py-3">
          <NewItem addItem={addItem} />
          <div className="row">
            <div className="col-md-5">
              <ListItems title="Unpacked Items" items={unPackedItems} />
            </div>

            <div className="offset-md-2 col-md-5">
              <ListItems title="Packed Items" items={packedItems} />
              <button
                onClick={makeAllUnpacked}
                className="btn btn-danger btn-lg btn-block"
              >
                Mark All As Unpacked
              </button>
            </div>
          </div>
        </div>
      </Context.Provider>
    </DragDropContext>
  );
};

export default App;
