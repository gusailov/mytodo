import React, { useState, createContext } from "react";
import { generate as id } from "shortid";
import NewItem from "./components/NewItem";
import ListItems from "./components/ListItems";
import { defaultState } from "./data";

export const AppContext = createContext();

const App = () => {
  const [items, setItems] = useState(defaultState);

  const addItem = (value) =>
    setItems((items) => ({
      items: [{ id: id(), value, packed: false }, ...items],
    }));

  const toggleItem = (id) =>
    setItems((items) => ({
      items: items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      ),
    }));

  const deleteItem = (id) =>
    setItems((items) => ({
      items: items.filter((item) => item.id !== id),
    }));

  const makeAllUnpacked = () =>
    setItems(({ items }) => ({
      items: items.map((item) =>
        item.packed ? { ...item, packed: false } : item
      ),
    }));

  const state = {
    items,
    deleteItem: deleteItem,
    toggleItem: toggleItem,
  };

  const packedItems = items.filter((item) => item.packed);
  const unPackedItems = items.filter((item) => !item.packed);

  return (
    <AppContext.Provider value={state}>
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
    </AppContext.Provider>
  );
};

export default App;
