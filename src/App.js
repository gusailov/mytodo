import React, { Component, createContext } from "react";
import { generate as id } from "shortid";
import NewItem from "./components/NewItem";
import ListItems from "./components/ListItems";
import { defaultState } from "./data";

export const AppContext = createContext();

class App extends Component {
  addItem = value =>
    this.setState(({ items }) => ({
      items: [{ id: id(), value, packed: false }, ...items]
    }));

  toggleItem = id =>
    this.setState(({ items }) => ({
      items: items.map(item =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    }));

  deleteItem = id =>
    this.setState(({ items }) => ({
      items: items.filter(item => item.id !== id)
    }));

  makeAllUnpacked = () =>
    this.setState(({ items }) => ({
      items: items.map(item =>
        item.packed ? { ...item, packed: false } : item
      )
    }));

  state = {
    items: defaultState,
    deleteItem: this.deleteItem,
    toggleItem: this.toggleItem
  };
  render() {
    const { items } = this.state;

    const packedItems = items.filter(item => item.packed);
    const unPackedItems = items.filter(item => !item.packed);

    return (
      <AppContext.Provider value={this.state}>
        <div className="container py-3">
          <NewItem addItem={this.addItem} />
          <div className="row">
            <div className="col-md-5">
              <ListItems title="Unpacked Items" items={unPackedItems} />
            </div>
            <div className="offset-md-2 col-md-5">
              <ListItems title="Packed Items" items={packedItems} />
              <button
                onClick={this.makeAllUnpacked}
                className="btn btn-danger btn-lg btn-block"
              >
                Mark All As Unpacked
              </button>
            </div>
          </div>
        </div>
      </AppContext.Provider>
    );
  }
}

export default App;
