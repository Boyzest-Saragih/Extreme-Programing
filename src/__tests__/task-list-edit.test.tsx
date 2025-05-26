
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import TaskList from "../components/task-list"
import type { Task } from "../types/task"

// Mock window.confirm
const mockConfirm = jest.fn()
global.confirm = mockConfirm

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

  it("renders edit and delete buttons for each task", () => {
    const mockOnUpdate = jest.fn()
    const mockOnDelete = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} onDeleteTask={mockOnDelete} />)

    expect(screen.getByTestId("edit-button-1")).toBeInTheDocument()
    expect(screen.getByTestId("edit-button-2")).toBeInTheDocument()
    expect(screen.getByTestId("delete-button-1")).toBeInTheDocument()
    expect(screen.getByTestId("delete-button-2")).toBeInTheDocument()
  })

  it("does not render delete buttons when onDeleteTask is not provided", () => {
    const mockOnUpdate = jest.fn()

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} />)

    expect(screen.getByTestId("edit-button-1")).toBeInTheDocument()
    expect(screen.getByTestId("edit-button-2")).toBeInTheDocument()
    expect(screen.queryByTestId("delete-button-1")).not.toBeInTheDocument()
    expect(screen.queryByTestId("delete-button-2")).not.toBeInTheDocument()
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

  it("handles delete task with confirmation", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()
    const mockOnDelete = jest.fn()
    mockConfirm.mockReturnValue(true)

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} onDeleteTask={mockOnDelete} />)

    const deleteButton = screen.getByTestId("delete-button-1")
    await user.click(deleteButton)

    expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this task?")
    expect(mockOnDelete).toHaveBeenCalledWith("1")
  })

  it("cancels delete when user declines confirmation", async () => {
    const user = userEvent.setup()
    const mockOnUpdate = jest.fn()
    const mockOnDelete = jest.fn()
    mockConfirm.mockReturnValue(false)

    render(<TaskList tasks={mockTasks} onUpdateTask={mockOnUpdate} onDeleteTask={mockOnDelete} />)

    const deleteButton = screen.getByTestId("delete-button-1")
    await user.click(deleteButton)

    expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this task?")
    expect(mockOnDelete).not.toHaveBeenCalled()
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
})
