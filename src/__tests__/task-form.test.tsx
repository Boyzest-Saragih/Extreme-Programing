"use client"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import TaskForm from "../components/task-form"

// Mock alert function
const mockAlert = jest.fn()
global.alert = mockAlert

describe("TaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all form fields correctly", () => {
    render(<TaskForm />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument()
  })

  it("allows user to type in title field", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, "Test Task Title")

    expect(titleInput).toHaveValue("Test Task Title")
  })

  it("allows user to type in description field", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, "Test task description")

    expect(descriptionInput).toHaveValue("Test task description")
  })

  it("allows user to select priority", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const prioritySelect = screen.getByLabelText(/priority/i)
    await user.selectOptions(prioritySelect, "high")

    expect(prioritySelect).toHaveValue("high")
  })

  it("allows user to select status", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const statusSelect = screen.getByLabelText(/status/i)
    await user.selectOptions(statusSelect, "in-progress")

    expect(statusSelect).toHaveValue("in-progress")
  })

  it("shows validation error when title is empty", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    expect(mockAlert).toHaveBeenCalledWith("Please enter a title")
  })

  it("shows validation error when priority is not selected", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, "Test Task")

    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    expect(mockAlert).toHaveBeenCalledWith("Please select a priority")
  })

  it("shows validation error when status is not selected", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const titleInput = screen.getByLabelText(/title/i)
    const prioritySelect = screen.getByLabelText(/priority/i)

    await user.type(titleInput, "Test Task")
    await user.selectOptions(prioritySelect, "high")

    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    expect(mockAlert).toHaveBeenCalledWith("Please select a status")
  })

  it("calls onSubmit with correct data when form is submitted successfully", async () => {
    const mockOnSubmit = jest.fn()
    const user = userEvent.setup()

    render(<TaskForm onSubmit={mockOnSubmit} />)

    // Fill out the form
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const prioritySelect = screen.getByLabelText(/priority/i)
    const statusSelect = screen.getByLabelText(/status/i)

    await user.type(titleInput, "Test Task Title")
    await user.type(descriptionInput, "Test task description")
    await user.selectOptions(prioritySelect, "high")
    await user.selectOptions(statusSelect, "in-progress")

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    // Verify onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "Test Task Title",
      description: "Test task description",
      priority: "high",
      status: "in-progress",
    })
  })

  it("resets form after successful submission", async () => {
    const mockOnSubmit = jest.fn()
    const user = userEvent.setup()

    render(<TaskForm onSubmit={mockOnSubmit} />)

    // Fill out the form
    const titleInput = screen.getByLabelText(/title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const prioritySelect = screen.getByLabelText(/priority/i)
    const statusSelect = screen.getByLabelText(/status/i)

    await user.type(titleInput, "Test Task Title")
    await user.type(descriptionInput, "Test task description")
    await user.selectOptions(prioritySelect, "high")
    await user.selectOptions(statusSelect, "in-progress")

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    // Verify form is reset
    expect(titleInput).toHaveValue("")
    expect(descriptionInput).toHaveValue("")
    expect(prioritySelect).toHaveValue("")
    expect(statusSelect).toHaveValue("")
  })

  it("handles form submission with only required fields", async () => {
    const mockOnSubmit = jest.fn()
    const user = userEvent.setup()

    render(<TaskForm onSubmit={mockOnSubmit} />)

    // Fill out only required fields
    const titleInput = screen.getByLabelText(/title/i)
    const prioritySelect = screen.getByLabelText(/priority/i)
    const statusSelect = screen.getByLabelText(/status/i)

    await user.type(titleInput, "Minimal Task")
    await user.selectOptions(prioritySelect, "low")
    await user.selectOptions(statusSelect, "to-do")

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    // Verify onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "Minimal Task",
      description: "",
      priority: "low",
      status: "to-do",
    })
  })

  it("trims whitespace from title during validation", async () => {
    const user = userEvent.setup()
    render(<TaskForm />)

    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, "   ") // Only whitespace

    const submitButton = screen.getByRole("button", { name: /add task/i })
    await user.click(submitButton)

    expect(mockAlert).toHaveBeenCalledWith("Please enter a title")
  })
})
