import React, { useState, useEffect } from "react";
import { generate as id } from "shortid";
import NewItem from "./components/NewItem";
import ListItems from "./components/ListItems";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "./components/Context";
import { DragDropContext } from "react-beautiful-dnd";

const App = () => {
  const [items, setItems] = useState(
    reactLocalStorage.getObject("items").length
      ? reactLocalStorage.getObject("items")
      : []
  );
  const [columns, setColumns] = useState(
    Object.keys(reactLocalStorage.getObject("columns")).length
      ? reactLocalStorage.getObject("columns")
      : {
          [id()]: { name: "Unpacked items", items: items },
          [id()]: { name: "Packed items", items: [] },
        }
  );
  console.log("items", items);
  console.log("columns", columns);
  const addItem = (value) => {
    const item = { id: id(), value, packed: false };
    setItems([item, ...items]);
    setColumns({
      ...columns,
      [Object.keys(columns)[0]]: {
        name: "Unpacked items",
        items: [item, ...items],
      },
    });
  };
  useEffect(() => {
    reactLocalStorage.setObject("columns", columns);
    reactLocalStorage.setObject("items", items);
  }, [columns, items]);

  const toggleItem = (id) => {
    console.log("toggleItem id", id);
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const deleteItem = (id) => {
    console.log("deleteItem");
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

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      console.log("toggleItem", removed.id);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
      toggleItem(removed.id);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <Context.Provider value={provider}>
        <div className="container py-3">
          <NewItem addItem={addItem} />
          <div className="row">
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div key={columnId} className="col-md-5">
                  <ListItems
                    key={columnId}
                    id={columnId}
                    title={column.name}
                    items={column.items}
                  />
                </div>
              );
            })}

            <div className="offset-md-2 col-md-5">
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
