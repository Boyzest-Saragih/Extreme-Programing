"use client"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import TaskList from "../components/task-list"
import type { Task } from "../types/task"

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Low Priority Task",
    description: "This is a low priority task",
    priority: "low",
    status: "to-do",
  },
  {
    id: "2",
    title: "High Priority Task",
    description: "This is a high priority task",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Medium Priority Task",
    description: "This is a medium priority task",
    priority: "medium",
    status: "done",
  },
  {
    id: "4",
    title: "Another High Priority",
    description: "Another high priority task",
    priority: "high",
    status: "to-do",
  },
]

describe("TaskList", () => {
  it("renders empty state when no tasks are provided", () => {
    render(<TaskList tasks={[]} />)

    expect(screen.getByText("No tasks yet")).toBeInTheDocument()
    expect(screen.getByText("Add your first task to get started!")).toBeInTheDocument()
  })

  it("displays all tasks", () => {
    render(<TaskList tasks={mockTasks} />)

    expect(screen.getByText("Low Priority Task")).toBeInTheDocument()
    expect(screen.getByText("High Priority Task")).toBeInTheDocument()
    expect(screen.getByText("Medium Priority Task")).toBeInTheDocument()
    expect(screen.getByText("Another High Priority")).toBeInTheDocument()
  })

  it("displays task descriptions", () => {
    render(<TaskList tasks={mockTasks} />)

    expect(screen.getByText("This is a low priority task")).toBeInTheDocument()
    expect(screen.getByText("This is a high priority task")).toBeInTheDocument()
    expect(screen.getByText("This is a medium priority task")).toBeInTheDocument()
    expect(screen.getByText("Another high priority task")).toBeInTheDocument()
  })

  it("displays correct task count", () => {
    render(<TaskList tasks={mockTasks} />)
    expect(screen.getByText("Task List (4 tasks)")).toBeInTheDocument()

    render(<TaskList tasks={[mockTasks[0]]} />)
    expect(screen.getByText("Task List (1 task)")).toBeInTheDocument()
  })

  it("sorts tasks by priority: high → medium → low", () => {
    render(<TaskList tasks={mockTasks} />)

    const taskItems = screen.getAllByTestId(/task-item-/)
    const taskTitles = taskItems.map((item) => item.querySelector("h3")?.textContent)

    // Expected order: high priority tasks first, then medium, then low
    expect(taskTitles).toEqual([
      "High Priority Task",
      "Another High Priority",
      "Medium Priority Task",
      "Low Priority Task",
    ])
  })

  it("displays priority badges with correct colors and text", () => {
    render(<TaskList tasks={mockTasks} />)

    // Check high priority
    const highPriorityBadges = screen.getAllByTestId("priority-high")
    expect(highPriorityBadges).toHaveLength(2)
    highPriorityBadges.forEach((badge) => {
      expect(badge).toHaveTextContent("High")
      expect(badge).toHaveClass("bg-red-100", "text-red-800", "border-red-200")
    })

    // Check medium priority
    const mediumPriorityBadge = screen.getByTestId("priority-medium")
    expect(mediumPriorityBadge).toHaveTextContent("Medium")
    expect(mediumPriorityBadge).toHaveClass("bg-yellow-100", "text-yellow-800", "border-yellow-200")

    // Check low priority
    const lowPriorityBadge = screen.getByTestId("priority-low")
    expect(lowPriorityBadge).toHaveTextContent("Low")
    expect(lowPriorityBadge).toHaveClass("bg-green-100", "text-green-800", "border-green-200")
  })

  it("displays status badges with correct colors and text", () => {
    render(<TaskList tasks={mockTasks} />)

    // Check to-do status (gray)
    const todoStatusBadges = screen.getAllByTestId("status-to-do")
    expect(todoStatusBadges).toHaveLength(2)
    todoStatusBadges.forEach((badge) => {
      expect(badge).toHaveTextContent("To-Do")
      expect(badge).toHaveClass("bg-gray-100", "text-gray-800", "border-gray-300")
    })

    // Check in-progress status (blue)
    const inProgressStatusBadge = screen.getByTestId("status-in-progress")
    expect(inProgressStatusBadge).toHaveTextContent("In Progress")
    expect(inProgressStatusBadge).toHaveClass("bg-blue-100", "text-blue-800", "border-blue-300")

    // Check done status (green)
    const doneStatusBadge = screen.getByTestId("status-done")
    expect(doneStatusBadge).toHaveTextContent("Done")
    expect(doneStatusBadge).toHaveClass("bg-green-100", "text-green-800", "border-green-300")
  })

  it("handles tasks without descriptions", () => {
    const tasksWithoutDescription: Task[] = [
      {
        id: "1",
        title: "Task without description",
        description: "",
        priority: "high",
        status: "to-do",
      },
    ]

    render(<TaskList tasks={tasksWithoutDescription} />)

    expect(screen.getByText("Task without description")).toBeInTheDocument()

    // Check that no description paragraph is rendered for empty descriptions
    const taskItem = screen.getByTestId("task-item-0")
    const descriptionParagraph = taskItem.querySelector("p")
    expect(descriptionParagraph).not.toBeInTheDocument()
  })

  it("shows description paragraph only when description exists", () => {
    const tasksWithAndWithoutDescription: Task[] = [
      {
        id: "1",
        title: "Task with description",
        description: "This task has a description",
        priority: "high",
        status: "to-do",
      },
      {
        id: "2",
        title: "Task without description",
        description: "",
        priority: "medium",
        status: "to-do",
      },
    ]

    render(<TaskList tasks={tasksWithAndWithoutDescription} />)

    // First task should have description paragraph
    const firstTaskItem = screen.getByTestId("task-item-0")
    const firstDescriptionParagraph = firstTaskItem.querySelector("p")
    expect(firstDescriptionParagraph).toBeInTheDocument()
    expect(firstDescriptionParagraph).toHaveTextContent("This task has a description")

    // Second task should not have description paragraph
    const secondTaskItem = screen.getByTestId("task-item-1")
    const secondDescriptionParagraph = secondTaskItem.querySelector("p")
    expect(secondDescriptionParagraph).not.toBeInTheDocument()
  })

  it("maintains consistent sorting with mixed priorities", () => {
    const mixedTasks: Task[] = [
      { id: "1", title: "Low 1", description: "", priority: "low", status: "to-do" },
      { id: "2", title: "High 1", description: "", priority: "high", status: "to-do" },
      { id: "3", title: "Medium 1", description: "", priority: "medium", status: "to-do" },
      { id: "4", title: "Low 2", description: "", priority: "low", status: "to-do" },
      { id: "5", title: "High 2", description: "", priority: "high", status: "to-do" },
    ]

    render(<TaskList tasks={mixedTasks} />)

    const taskItems = screen.getAllByTestId(/task-item-/)
    const taskTitles = taskItems.map((item) => item.querySelector("h3")?.textContent)

    // All high priority tasks should come first, then medium, then low
    expect(taskTitles).toEqual(["High 1", "High 2", "Medium 1", "Low 1", "Low 2"])
  })

  it("renders task items with proper test ids", () => {
    render(<TaskList tasks={mockTasks} />)

    expect(screen.getByTestId("task-item-0")).toBeInTheDocument()
    expect(screen.getByTestId("task-item-1")).toBeInTheDocument()
    expect(screen.getByTestId("task-item-2")).toBeInTheDocument()
    expect(screen.getByTestId("task-item-3")).toBeInTheDocument()
  })
})
