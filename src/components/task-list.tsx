"use client"

export interface Task {
  id?: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "to-do" | "in-progress" | "done"
}

interface TaskListProps {
  tasks: Task[]
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

export default function TaskList({ tasks }: TaskListProps) {
  // Sort tasks by priority: high -> medium -> low
  const sortedTasks = [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
