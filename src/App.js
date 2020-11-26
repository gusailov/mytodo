import React, { useState, useEffect } from "react";
import { generate as id } from "shortid";
import NewItem from "./components/NewItem";
import ListItems from "./components/ListItems";
import { reactLocalStorage } from "reactjs-localstorage";
import { Context } from "./components/Context";
import { DragDropContext } from "react-beautiful-dnd";
import { findKey, find, remove, filter } from "lodash";

const App = () => {
  const [columns, setColumns] = useState(
    Object.keys(reactLocalStorage.getObject("columns")).length
      ? reactLocalStorage.getObject("columns")
      : {
          [id()]: { name: "Unpacked items", items: [] },
          [id()]: { name: "Packed items", items: [] },
        }
  );
  const unpackedID = [Object.keys(columns)[0]];
  const packedID = [Object.keys(columns)[1]];
  console.log("columns", columns);

  const unpackedItems = [...columns[Object.keys(columns)[0]].items];
  //console.log("unpackedItems", unpackedItems);
  const packedItems = [...columns[Object.keys(columns)[1]].items];
  console.log("packedItems", packedItems);

  const addItem = (value) => {
    const item = { id: id(), value, packed: false };
    setColumns({
      ...columns,
      [unpackedID]: {
        name: "Unpacked items",
        items: [item, ...unpackedItems],
      },
    });
  };
  useEffect(() => {
    reactLocalStorage.setObject("columns", columns);
  }, [columns]);

  const toggleItem = (item) => {
    if (!item.packed) {
      remove(unpackedItems, item);
      setColumns({
        ...columns,
        [unpackedID]: {
          name: "Unpacked items",
          items: unpackedItems,
        },
        [packedID]: {
          name: "Packed items",
          items: [{ ...item, packed: !item.packed }, ...packedItems],
        },
      });
    }
    if (item.packed) {
      remove(packedItems, item);
      setColumns({
        ...columns,
        [unpackedID]: {
          name: "Unpacked items",
          items: [{ ...item, packed: !item.packed }, ...unpackedItems],
        },
        [packedID]: {
          name: "Packed items",
          items: packedItems,
        },
      });
    }
  };

  const deleteItem = (item) => {
    remove(packedItems, item);
    remove(unpackedItems, item);
    setColumns({
      ...columns,
      [unpackedID]: {
        name: "Unpacked items",
        items: unpackedItems,
      },
      [packedID]: {
        name: "Packed items",
        items: packedItems,
      },
    });
  };

  const makeAllUnpacked = () => {
    console.log("!packedItems", !packedItems.length);

    if (!packedItems.length) {
      return;
    } else {
      const all = [
        packedItems.map((item) => [{ ...item, packed: !item.packed }]),
      ];
      console.log("all", ...all);
      const itemsSuMM = [...all, ...unpackedItems];
      console.log("itemsSuMM", itemsSuMM);
      setColumns({
        ...columns,
        [unpackedID]: {
          name: "Unpacked items",
          items: [...all, ...unpackedItems],
        },
        [packedID]: {
          name: "Packed items",
          items: [],
        },
      });
    }
  };

  const provider = {
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

      destItems.splice(destination.index, 0, {
        ...removed,
        packed: !removed.packed,
      });
      console.log("removed", removed);
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
