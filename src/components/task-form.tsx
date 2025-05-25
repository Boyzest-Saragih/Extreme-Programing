"use client"

import type React from "react"
import { useState } from "react"

interface TaskFormData {
  title: string
  description: string
  priority: string
  status: string
}

interface TaskFormProps {
  onSubmit?: (data: TaskFormData) => void
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "",
    status: "",
  })

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title.trim()) {
      alert("Please enter a title")
      return
    }

    if (!formData.priority) {
      alert("Please select a priority")
      return
    }

    if (!formData.status) {
      alert("Please select a status")
      return
    }

    // Call the onSubmit prop if provided, otherwise use default behavior
    if (onSubmit) {
      onSubmit(formData)
    } else {
      console.log("Task submitted:", formData)
      alert("Task added successfully!")
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "",
      status: "",
    })
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description (optional)"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          {/* Priority Field */}
          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority *
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              required
            >
              <option value="">Select priority level</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              required
            >
              <option value="">Select task status</option>
              <option value="to-do">⚪ To-Do</option>
              <option value="in-progress">🔵 In Progress</option>
              <option value="done">🟢 Done</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}
