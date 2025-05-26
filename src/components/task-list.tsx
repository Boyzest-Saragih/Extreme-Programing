"use client"

import { useState } from "react"
import type { Task } from "../types/task"

interface TaskListProps {
  tasks: Task[]
  onUpdateTask?: (taskId: string, updatedTask: Omit<Task, "id">) => void
}

const priorityOrder = { high: 1, medium: 2, low: 3 }

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "to-do":
      return "bg-gray-100 text-gray-800 border-gray-300"
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "done":
      return "bg-green-100 text-green-800 border-green-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "to-do":
      return "⚪"
    case "in-progress":
      return "🔵"
    case "done":
      return "🟢"
    default:
      return "⚪"
  }
}

const getPriorityIcon = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "🔴"
    case "medium":
      return "🟡"
    case "low":
      return "🟢"
    default:
      return "⚪"
  }
}

export default function TaskList({ tasks, onUpdateTask }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    priority: "medium",
    status: "to-do",
  })

  // Sort tasks by priority: high -> medium -> low
  const sortedTasks = [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const handleEditStart = (task: Task) => {
    setEditingTaskId(task.id || null)
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    })
  }

  const handleEditCancel = () => {
    setEditingTaskId(null)
    setEditForm({
      title: "",
      description: "",
      priority: "medium",
      status: "to-do",
    })
  }

  const handleEditSave = () => {
    if (!editingTaskId || !editForm.title.trim()) {
      alert("Please enter a title")
      return
    }

    if (onUpdateTask) {
      onUpdateTask(editingTaskId, {
        ...editForm,
        title: editForm.title.trim(),
      })
    }

    setEditingTaskId(null)
    setEditForm({
      title: "",
      description: "",
      priority: "medium",
      status: "to-do",
    })
  }

  if (tasks.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Add your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Task List ({tasks.length} {tasks.length === 1 ? "task" : "tasks"})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedTasks.map((task, index) => (
            <div
              key={task.id || index}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
              data-testid={`task-item-${index}`}
            >
              {editingTaskId === task.id ? (
                // Edit Mode
                <div className="space-y-4" data-testid="edit-form">
                  <div>
                    <label htmlFor={`edit-title-${task.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      id={`edit-title-${task.id}`}
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      data-testid="edit-title-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`edit-description-${task.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id={`edit-description-${task.id}`}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none"
                      rows={3}
                      data-testid="edit-description-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`edit-priority-${task.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Priority
                      </label>
                      <select
                        id={`edit-priority-${task.id}`}
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Task["priority"] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        data-testid="edit-priority-select"
                      >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-status-${task.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id={`edit-status-${task.id}`}
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Task["status"] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        data-testid="edit-status-select"
                      >
                        <option value="to-do">⚪ To-Do</option>
                        <option value="in-progress">🔵 In Progress</option>
                        <option value="done">🟢 Done</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleEditSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium"
                      data-testid="save-edit-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm font-medium"
                      data-testid="cancel-edit-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{task.title}</h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            task.priority,
                          )}`}
                          data-testid={`priority-${task.priority}`}
                        >
                          {getPriorityIcon(task.priority)}
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            task.status,
                          )}`}
                          data-testid={`status-${task.status}`}
                        >
                          {getStatusIcon(task.status)}
                          {task.status === "to-do" ? "To-Do" : task.status === "in-progress" ? "In Progress" : "Done"}
                        </span>
                      </div>
                    </div>
                    {task.description && <p className="text-gray-600 text-sm leading-relaxed">{task.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditStart(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit task"
                      data-testid={`edit-button-${task.id}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
