import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

interface Task {
  title: string;
  completed: boolean;
}

const socket = io("http://localhost:5000/");

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fetchAllTasks")
      .then((response) => {
        const validTasks = response.data.filter(
          (task: Task) => task.title && task.title.trim() !== ""
        );
        setTasks(validTasks);
      })
      .catch((error) => console.error("Error fetching tasks:", error));

    socket.on("newTask", (task: Task) => {
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
