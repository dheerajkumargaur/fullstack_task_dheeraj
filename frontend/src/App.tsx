import React from "react";
import AddTask from "./component/AddTask/AddTask";
import TaskList from "./component/TaskList/TaskList";
import "./App.css"; 

const App: React.FC = () => (
  <div className="app">
    <header className="app-header">
      <img src="note-icon.png" alt="Note App" />
      <h1>Note App</h1>
    </header>
    <AddTask />
    <TaskList />
  </div>
);

export default App;
