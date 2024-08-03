"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/assignment");
const taskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const TaskModel = mongoose_1.default.model("Task", taskSchema);
const initialTasks = [
    { title: "Buy groceries" },
    { title: "Complete homework" },
    { title: "Clean the house" },
    { title: "Pay bills" },
    { title: "Call the bank" },
    { title: "Prepare dinner" },
    { title: "Read a book" },
    { title: "Go for a walk" },
    { title: "Write a blog post" },
    { title: "Exercise for 30 minutes" },
];
TaskModel.insertMany(initialTasks)
    .then(() => {
    console.log("Initial tasks inserted");
    mongoose_1.default.connection.close();
})
    .catch((err) => {
    console.error("Error inserting initial tasks:", err);
});
//# sourceMappingURL=seed.js.map