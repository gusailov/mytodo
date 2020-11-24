import React, { useState } from "react";
import Item from "./Item";
import Filter from "./Filter";
import { Droppable } from "react-beautiful-dnd";

const ListItems = (props) => {
  const [searchTerm, setsearchTerm] = useState("");

  const updateFilter = ({ target }) => {
    setsearchTerm(target.value);
  };

  const getBody = () => {
    const { title, items } = props;
    let out = [...items];

    if (searchTerm) {
      out = out.filter((item) =>
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return out.map((item, index) => (
      <Item title={title} index={index} item={item} key={item.id} />
    ));
  };

  return (
    <section>
      <h3 className="mb-3">{props.title}</h3>
      <Filter filter={searchTerm} onChange={updateFilter} />
      <Droppable droppableId={props.title}>
        {(provided, snapshot) => (
          <ul
            className="mb-3 p-0"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {getBody()}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </section>
  );
};

export default ListItems;
