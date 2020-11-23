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
  const onDragEnd = (e) => {
    console.log("onDragEnd", e);
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
      onDragEnd={onDragEnd}
    >
      <Context.Provider value={provider}>
        <div className="container py-3">
          <NewItem addItem={addItem} />
          <div className="row">
            <Droppable droppableId="unPacked" type="PERSON">
              {(provided, snapshot) => (
                <div
                  className="col-md-5"
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? "blue" : "grey",
                  }}
                  {...provided.droppableProps}
                >
                  <ListItems title="Unpacked Items" items={unPackedItems} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="packed" type="PERSON">
              {(provided, snapshot) => (
                <div
                  className="offset-md-2 col-md-5"
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? "blue" : "grey",
                  }}
                  {...provided.droppableProps}
                >
                  <ListItems title="Packed Items" items={packedItems} />
                  <button
                    onClick={makeAllUnpacked}
                    className="btn btn-danger btn-lg btn-block"
                  >
                    Mark All As Unpacked
                  </button>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </Context.Provider>
    </DragDropContext>
  );
};

export default App;
