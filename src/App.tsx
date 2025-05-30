"use client"

import TaskForm from "./components/task-form"
import TaskList from "./components/task-list"
import type { Task, TaskFormData } from "./types/task"
import { useLocalStorage } from "./hooks/use-local-storage"

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])

  const handleAddTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(), 
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const handleUpdateTask = (taskId: string, updatedTask: Omit<Task, "id">) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
  }

    const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  const handleClearAllTasks = () => {
    if (window.confirm("Are you sure you want to clear all tasks? This action cannot be undone.")) {
      setTasks([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-2">Manage your tasks efficiently</p>
          <p className="text-sm text-gray-500 mt-1">Your tasks are automatically saved to your browser</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Form */}
          <div>
            <TaskForm onSubmit={handleAddTask} />
          </div>

          {/* Task List */}
          <div>
            <TaskList tasks={tasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />

            {/* Clear All Button */}
            {tasks.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleClearAllTasks}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  data-testid="clear-all-button"
                >
                  Clear All Tasks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



