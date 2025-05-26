"use client"
import { renderHook, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import { useLocalStorage } from "../hooks/use-local-storage"
import type { Task } from "../types/task"
import { jest } from "@jest/globals"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  it("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial-value"))

    expect(result.current[0]).toBe("initial-value")
  })

  it("returns stored value from localStorage", () => {
    localStorageMock.setItem("test-key", JSON.stringify("stored-value"))

    const { result } = renderHook(() => useLocalStorage("test-key", "initial-value"))

    expect(result.current[0]).toBe("stored-value")
  })

  it("updates localStorage when value is set", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial-value"))

    act(() => {
      result.current[1]("new-value")
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify("new-value"))
    expect(result.current[0]).toBe("new-value")
  })

  it("works with function updates", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(1))
  })

  it("works with complex objects", () => {
    const initialValue = { name: "test", count: 0 }
    const { result } = renderHook(() => useLocalStorage("test-key", initialValue))

    const newValue = { name: "updated", count: 5 }

    act(() => {
      result.current[1](newValue)
    })

    expect(result.current[0]).toEqual(newValue)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(newValue))
  })

  it("handles localStorage errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error("localStorage error")
    })

    const { result } = renderHook(() => useLocalStorage("test-key", "initial-value"))

    act(() => {
      result.current[1]("new-value")
    })

    expect(consoleSpy).toHaveBeenCalledWith("Error saving to localStorage:", expect.any(Error))
    expect(result.current[0]).toBe("new-value") // State should still update

    consoleSpy.mockRestore()
  })

  it("handles JSON parse errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
    localStorageMock.getItem.mockReturnValue("invalid-json")

    const { result } = renderHook(() => useLocalStorage("test-key", "initial-value"))

    expect(consoleSpy).toHaveBeenCalledWith("Error reading from localStorage:", expect.any(Error))
    expect(result.current[0]).toBe("initial-value")

    consoleSpy.mockRestore()
  })

  it("works with arrays", () => {
    const initialTasks: Task[] = [
      { id: "1", title: "Task 1", description: "", priority: "high", status: "to-do" },
      { id: "2", title: "Task 2", description: "", priority: "low", status: "done" },
    ]

    const { result } = renderHook(() => useLocalStorage("tasks", initialTasks))

    const newTask: Task = { id: "3", title: "Task 3", description: "", priority: "medium", status: "to-do" }

    act(() => {
      result.current[1]((prev) => [...prev, newTask])
    })

    expect(result.current[0]).toHaveLength(3)
    expect(result.current[0][2]).toEqual(newTask)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("tasks", JSON.stringify([...initialTasks, newTask]))
  })
})
