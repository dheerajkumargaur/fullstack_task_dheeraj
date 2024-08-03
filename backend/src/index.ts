import express, { Request, Response }  from 'express';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { createClient } from "redis";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
dotenv.config(); 
app.use(cors());

const fetchAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tasks = await getTasksFromRedis();
  res.json(tasks);
};

const addTask = async (task: string): Promise<void> => {
  let tasks = await getTasksFromRedis();
  tasks.push(task);

  if (tasks.length > 50) {
    await saveTasksToMongoDB(tasks);
    await flushTasksFromRedis();
  } else {
    await setTasksInRedis(tasks);
  }
};

mongoose.connect(process.env.MONGODB_URL!);

const taskSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

const saveTasksToMongoDB = async (tasks: string[]): Promise<void> => {
  await Task.insertMany(tasks.map((task) => ({ task })));
};

const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect();

const getTasksFromRedis = async (): Promise<string[]> => {
  const tasks = await redisClient.get(
    `FULLSTACK_TASK_DHEERAJ`
  );
  return tasks ? JSON.parse(tasks) : [];
};

const setTasksInRedis = async (tasks: string[]): Promise<void> => {
  await redisClient.set(
    `FULLSTACK_TASK_DHEERAJ`,
    JSON.stringify(tasks)
  );
};

const flushTasksFromRedis = async (): Promise<void> => {
  await redisClient.del(`FULLSTACK_TASK_DHEERAJ`);
};


const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/fetchAllTasks", fetchAllTasks);

app.use(express.json());

app.use("/", (req, res) => {
  res.status(200).json("server is running");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("add", async (task: string) => {
    await addTask(task);
    socket.emit("taskAdded", task);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


app.listen(process.env.PORT, () => {
  console.log(`server is running on port: ${process.env.PORT}`);
});
