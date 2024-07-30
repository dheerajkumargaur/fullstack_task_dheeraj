import React, { useState } from "react";
import io from "socket.io-client";

const socket = io("https://fullstack-task-dheeraj.onrender.com/");

const AddTask = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() !== "") {
      const newTask = { title, completed: false };
      socket.emit("add", newTask);
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Note..."
        required
      />
      <button type="submit">+ Add</button>
    </form>
  );
};

export default AddTask;
