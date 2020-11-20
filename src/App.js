import React, { useState, createContext } from "react";
import { generate as id } from "shortid";
import NewItem from "./components/NewItem";
import ListItems from "./components/ListItems";
import { reactLocalStorage } from "reactjs-localstorage";

export const AppContext = createContext();

const App = () => {
  const [items, setItems] = useState(
    reactLocalStorage.getObject("items").length
      ? reactLocalStorage.getObject("items")
      : []
  );

  const addItem = (value) => {
    setItems([{ id: id(), value, packed: false }, ...items]);
    reactLocalStorage.setObject("items", [
      { id: id(), value, packed: false },
      ...items,
    ]);
  };

  const toggleItem = (id) => {
    const set = items.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    );
    setItems(set);
    reactLocalStorage.setObject("items", set);
  };

  const deleteItem = (id) => {
    const del = items.filter((item) => item.id !== id);
    setItems(del);
    reactLocalStorage.setObject("items", del);
  };

  const makeAllUnpacked = () => {
    const AllUnpacked = items.map((item) =>
      item.packed ? { ...item, packed: false } : item
    );
    setItems(AllUnpacked);
    reactLocalStorage.setObject("items", AllUnpacked);
  };

  const provider = {
    items,
    deleteItem,
    toggleItem,
  };

  const packedItems = items.filter ? items.filter((item) => item.packed) : [];
  const unPackedItems = items.filter
    ? items.filter((item) => !item.packed)
    : [];

  return (
    <AppContext.Provider value={provider}>
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
