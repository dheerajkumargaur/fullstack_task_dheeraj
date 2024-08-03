"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
const fetchAllTasks = async (req, res) => {
    const tasks = await getTasksFromRedis();
    res.json(tasks);
};
const addTask = async (task) => {
    let tasks = await getTasksFromRedis();
    tasks.push(task);
    if (tasks.length > 50) {
        await saveTasksToMongoDB(tasks);
        await flushTasksFromRedis();
    }
    else {
        await setTasksInRedis(tasks);
    }
};
mongoose_1.default.connect(process.env.MONGODB_URL);
const taskSchema = new mongoose_1.default.Schema({
    task: String,
    completed: Boolean,
});
const Task = mongoose_1.default.model("Task", taskSchema);
const saveTasksToMongoDB = async (tasks) => {
    await Task.insertMany(tasks.map((task) => ({ task })));
};
const redisClient = (0, redis_1.createClient)({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();
const getTasksFromRedis = async () => {
    const tasks = await redisClient.get(`FULLSTACK_TASK_DHEERAJ`);
    return tasks ? JSON.parse(tasks) : [];
};
const setTasksInRedis = async (tasks) => {
    await redisClient.set(`FULLSTACK_TASK_DHEERAJ`, JSON.stringify(tasks));
};
const flushTasksFromRedis = async () => {
    await redisClient.del(`FULLSTACK_TASK_DHEERAJ`);
};
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.get("/fetchAllTasks", fetchAllTasks);
app.use(express_1.default.json());
app.use("/", (req, res) => {
    res.status(200).json("server is running");
});
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("add", async (task) => {
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
//# sourceMappingURL=index.js.map