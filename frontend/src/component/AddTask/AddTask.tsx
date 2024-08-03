import React, { useState, FormEvent, ChangeEvent } from "react";
import io from "socket.io-client";

const socket = io("https://fullstack-task-dheeraj.onrender.com/");


const AddTask: React.FC = () => {
  const [title, setTitle] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() !== "") {
      const newTask = { title, completed: false };
      socket.emit("add", newTask);
      setTitle("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="New Note..."
        required
      />
      <button type="submit">+ Add</button>
    </form>
  );
};

export default AddTask;
