"use client"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import TaskList from "../components/task-list"
import type { Task } from "../types/task"

// Mock alert function
const mockAlert = jest.fn()
global.alert = mockAlert

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Test Task",
    description: "Test description",
    priority: "high",
    status: "to-do",
  },
  {
    id: "2",
    title: "Another Task",
    description: "Another description",
    priority: "medium",
    status: "in-progress",
  },
]

describe("TaskList - Edit Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders edit button for each task", () => {
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    expect(screen.getByTestId("edit-button-1")).toBeInTheDocument()
    expect(screen.getByTestId("edit-button-2")).toBeInTheDocument()
  })

  it("enters edit mode when edit button is clicked", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    expect(screen.getByTestId("edit-form")).toBeInTheDocument()
    expect(screen.getByTestId("edit-title-input")).toHaveValue("Test Task")
    expect(screen.getByTestId("edit-description-input")).toHaveValue("Test description")
    expect(screen.getByTestId("edit-priority-select")).toHaveValue("high")
    expect(screen.getByTestId("edit-status-select")).toHaveValue("to-do")
  })

  it("allows editing task fields", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    // Enter edit mode
    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    // Edit fields
    const titleInput = screen.getByTestId("edit-title-input")
    const descriptionInput = screen.getByTestId("edit-description-input")
    const prioritySelect = screen.getByTestId("edit-priority-select")
    const statusSelect = screen.getByTestId("edit-status-select")

    await user.clear(titleInput)
    await user.type(titleInput, "Updated Task Title")
    await user.clear(descriptionInput)
    await user.type(descriptionInput, "Updated description")
    await user.selectOptions(prioritySelect, "low")
    await user.selectOptions(statusSelect, "done")

    expect(titleInput).toHaveValue("Updated Task Title")
    expect(descriptionInput).toHaveValue("Updated description")
    expect(prioritySelect).toHaveValue("low")
    expect(statusSelect).toHaveValue("done")
  })

  it("saves changes when save button is clicked", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    // Enter edit mode
    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    // Edit fields
    const titleInput = screen.getByTestId("edit-title-input")
    const descriptionInput = screen.getByTestId("edit-description-input")
    const prioritySelect = screen.getByTestId("edit-priority-select")
    const statusSelect = screen.getByTestId("edit-status-select")

    await user.clear(titleInput)
    await user.type(titleInput, "Updated Task Title")
    await user.clear(descriptionInput)
    await user.type(descriptionInput, "Updated description")
    await user.selectOptions(prioritySelect, "low")
    await user.selectOptions(statusSelect, "done")

    // Save changes
    const saveButton = screen.getByTestId("save-edit-button")
    await user.click(saveButton)

    expect(mockOnUpdate).toHaveBeenCalledWith("1", {
      title: "Updated Task Title",
      description: "Updated description",
      priority: "low",
      status: "done",
    })

    // Should exit edit mode
    expect(screen.queryByTestId("edit-form")).not.toBeInTheDocument()
  })

  it("cancels edit mode when cancel button is clicked", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    // Enter edit mode
    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    // Edit a field
    const titleInput = screen.getByTestId("edit-title-input")
    await user.clear(titleInput)
    await user.type(titleInput, "Changed Title")

    // Cancel changes
    const cancelButton = screen.getByTestId("cancel-edit-button")
    await user.click(cancelButton)

    expect(mockOnUpdate).not.toHaveBeenCalled()
    expect(screen.queryByTestId("edit-form")).not.toBeInTheDocument()

    // Original task should still be displayed
    expect(screen.getByText("Test Task")).toBeInTheDocument()
  })

  it("validates title is not empty when saving", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    // Enter edit mode
    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    // Clear title
    const titleInput = screen.getByTestId("edit-title-input")
    await user.clear(titleInput)

    // Try to save
    const saveButton = screen.getByTestId("save-edit-button")
    await user.click(saveButton)

    expect(mockAlert).toHaveBeenCalledWith("Please enter a title")
    expect(mockOnUpdate).not.toHaveBeenCalled()
    expect(screen.getByTestId("edit-form")).toBeInTheDocument() // Should stay in edit mode
  })

  it("trims whitespace from title when saving", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    // Enter edit mode
    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    // Set title with whitespace
    const titleInput = screen.getByTestId("edit-title-input")
    await user.clear(titleInput)
    await user.type(titleInput, "  Trimmed Title  ")

    // Save changes
    const saveButton = screen.getByTestId("save-edit-button")
    await user.click(saveButton)

    expect(mockOnUpdate).toHaveBeenCalledWith("1", {
      title: "Trimmed Title", // Should be trimmed
      description: "Test description",
      priority: "high",
      status: "to-do",
    })
  })

  it("only allows editing one task at a time", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    // Start editing first task
    const editButton1 = screen.getByTestId("edit-button-1")
    await user.click(editButton1)

    expect(screen.getByTestId("edit-form")).toBeInTheDocument()

    // Try to edit second task
    const editButton2 = screen.getByTestId("edit-button-2")
    await user.click(editButton2)

    // Should now be editing the second task, not the first
    expect(screen.getByTestId("edit-title-input")).toHaveValue("Another Task")
    expect(screen.getByTestId("edit-description-input")).toHaveValue("Another description")
    expect(screen.getByTestId("edit-priority-select")).toHaveValue("medium")
    expect(screen.getByTestId("edit-status-select")).toHaveValue("in-progress")
  })

  it("handles tasks without onUpdateTask callback", async () => {
    const user = userEvent.setup()

    render(<TaskList tasks={mockTasks} />)

    // Edit buttons should still be present
    expect(screen.getByTestId("edit-button-1")).toBeInTheDocument()

    // Enter edit mode
    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    expect(screen.getByTestId("edit-form")).toBeInTheDocument()

    // Save should work without error (though no callback will be called)
    const saveButton = screen.getByTestId("save-edit-button")
    await user.click(saveButton)

    expect(screen.queryByTestId("edit-form")).not.toBeInTheDocument()
  })

  it("maintains task sorting after editing", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    const tasks: Task[] = [
      { id: "1", title: "Low Task", description: "", priority: "low", status: "to-do" },
      { id: "2", title: "High Task", description: "", priority: "high", status: "to-do" },
    ]

    render(<TaskList tasks={tasks} onUpdateTask={mockOnUpdate} />)

    // Initially, high priority should be first
    const taskItems = screen.getAllByTestId(/task-item-/)
    const taskTitles = taskItems.map((item) => item.querySelector("h3")?.textContent)
    expect(taskTitles).toEqual(["High Task", "Low Task"])

    // Edit the high priority task to make it low priority
    const editButton = screen.getByTestId("edit-button-2") // High task is at index 0, but button has task id
    await user.click(editButton)

    const prioritySelect = screen.getByTestId("edit-priority-select")
    await user.selectOptions(prioritySelect, "low")

    const saveButton = screen.getByTestId("save-edit-button")
    await user.click(saveButton)

    expect(mockOnUpdate).toHaveBeenCalledWith("2", {
      title: "High Task",
      description: "",
      priority: "low",
      status: "to-do",
    })
  })

  it("handles editing task with empty description", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()

    const tasks: Task[] = [{ id: "1", title: "Task", description: "", priority: "medium", status: "to-do" }]

    render(<TaskList tasks={tasks} onUpdateTask={mockOnUpdate} />)

    const editButton = screen.getByTestId("edit-button-1")
    await user.click(editButton)

    // Description should be empty
    const descriptionInput = screen.getByTestId("edit-description-input")
    expect(descriptionInput).toHaveValue("")

    // Add description
    await user.type(descriptionInput, "New description")

    const saveButton = screen.getByTestId("save-edit-button")
    await user.click(saveButton)

    expect(mockOnUpdate).toHaveBeenCalledWith("1", {
      title: "Task",
      description: "New description",
      priority: "medium",
      status: "to-do",
    })
  })
})
