const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/assignment"
);

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

const initialTasks = [
  { title: "Buy groceries", completed: false },
  { title: "Complete homework", completed: false },
  { title: "Clean the house", completed: false },
  { title: "Pay bills", completed: false },
  { title: "Call the bank", completed: false },
  { title: "Prepare dinner", completed: false },
  { title: "Read a book", completed: false },
  { title: "Go for a walk", completed: false },
  { title: "Write a blog post", completed: false },
  { title: "Exercise for 30 minutes", completed: false },
];

Task.insertMany(initialTasks)
  .then(() => {
    console.log("Initial tasks inserted");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting initial tasks:", err);
  });
