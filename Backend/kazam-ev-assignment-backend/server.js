const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const redis = require("redis");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

mongoose.connect("mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/assignment");

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

app.use(bodyParser.json());
app.use(cors());

app.get("/fetchAllTasks", async (req, res) => {
  try {
    const tasks = await Task.find({ title: { $ne: "" } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("add", async (task) => {
    try {
      redisClient.lpush(
        "FULLSTACK_TASK_DHEERAJ",
        JSON.stringify(task),
        async (err, reply) => {
          if (err) throw err;

          redisClient.llen("FULLSTACK_TASK_DHEERAJ", async (err, len) => {
            if (err) throw err;

            if (len > 50) {
              redisClient.lrange(
                "FULLSTACK_TASK_DHEERAJ",
                0,
                50,
                async (err, tasks) => {
                  if (err) throw err;

                  const taskDocs = tasks.map(
                    (task) => new Task(JSON.parse(task))
                  );
                  await Task.insertMany(taskDocs);
                  redisClient.ltrim("FULLSTACK_TASK_DHEERAJ", 51, -1);
                }
              );
            }
          });

          // Emit the new task to all connected clients
          io.emit("newTask", task);
        }
      );
    } catch (error) {
      console.error("Error adding task:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
