export interface Task {
  id?: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "to-do" | "in-progress" | "done"
}

export type TaskFormData = Omit<Task, "id">
