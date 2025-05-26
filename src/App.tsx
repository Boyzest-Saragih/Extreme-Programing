"use client"

import { useState } from "react"
import TaskForm from "./components/task-form"
import TaskList from "./components/task-list"
import type { Task, TaskFormData } from "./types/task"

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(), // Simple ID generation
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const handleUpdateTask = (taskId: string, updatedTask: Omit<Task, "id">) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Form */}
          <div>
            <TaskForm onSubmit={handleAddTask} />
          </div>

          {/* Task List */}
          <div>
            <TaskList tasks={tasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
          </div>
        </div>
      </div>
    </div>
  )
}
