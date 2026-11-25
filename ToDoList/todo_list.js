// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// Storage configuration
const STORAGE_KEY = "todo_tasks";

// Load tasks from localStorage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );

    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

// Initialize tasks
let tasks = loadTasks();

// Save tasks to localStorage
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving tasks:", error);
    }
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Display all tasks
function displayTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {

        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.id = `task-${task.id}`;

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.append(checkbox, label, deleteBtn);

        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();
    displayTasks();
}

// Delete an individual task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    displayTasks();
}

// Clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    displayTasks();
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);

clearCompletedBtn.addEventListener("click", clearCompletedTasks);

// Allow adding tasks using Enter
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Initial rendering
displayTasks();