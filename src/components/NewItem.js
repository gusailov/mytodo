import React, { useState } from "react";

const NewItem = (props) => {
  const [value, setValue] = useState("");

  const handleChange = ({ target }) => setValue(target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addItem(value);
    setValue(" ");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-9">
          <input
            className="form-control mb-3"
            type="text"
            onChange={handleChange}
            value={value}
          />
        </div>
        <div className="col-md-3">
          <input className="btn btn-success" type="submit" value="Add item" />
        </div>
      </div>
    </form>
  );
};

export default NewItem;
