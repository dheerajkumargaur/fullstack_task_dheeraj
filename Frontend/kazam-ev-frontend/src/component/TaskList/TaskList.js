import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("https://fullstack-task-dheeraj.onrender.com/");

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/fetchAllTasks")
      .then((response) => {
        const validTasks = response.data.filter(
          (task) => task.title && task.title.trim() !== ""
        );
        setTasks(validTasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));

    socket.on("newTask", (task) => {
      if (task.title && task.title.trim() !== "") {
        setTasks((prevTasks) => [...prevTasks, task]);
      }
    });

    return () => {
      socket.off("newTask");
    };
  }, []);

  return (
    <div className="task-list">
      <h2>Notes</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
