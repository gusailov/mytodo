import React, { useState } from "react";
import Item from "./Item";
import Filter from "./Filter";

const ListItems =(props)=> {
  
  const [searchTerm, setsearchTerm] = useState("");
  
  const updateFilter = ({ target }) => {
    setsearchTerm(target.value);
  };
  
 const getBody = () => {
      const { title, items } = props;
    let out = [...items];
     if (searchTerm) {
      out = out.filter(item =>
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
        return out.map(item => <Item title={title} item={item} key={item.id} />);
  }
  
   
    return (
     
      <section>
        <h3 className="mb-3">Title</h3>
        <Filter filter={searchTerm} onChange={updateFilter} />

        <ul className="mb-3 p-0">{getBody()}</ul>
      </section>
    );
  
}

export default ListItems;
