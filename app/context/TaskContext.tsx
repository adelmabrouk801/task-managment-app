"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  assignee: string;
  startDate: string;
  endDate: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  editTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  filter: {
    status: "all" | "completed" | "incomplete";
    assignee: string;
    date: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      status: "all" | "completed" | "incomplete";
      assignee: string;
      date: string;
    }>
  >;
  assignees: string[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filter, setFilter] = useState({
    status: "all" as "all" | "completed" | "incomplete",
    assignee: "all",
    date: "",
  });
  const { toast } = useToast();

  const assignees = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams"];

  const addTask = useCallback(
    (task: Omit<Task, "id" | "completed">) => {
      try {
        const newTask = {
          ...task,
          id: Date.now().toString(),
          completed: false,
          assignee: task.assignee === "unassigned" ? "" : task.assignee,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        toast({
          title: "Task added",
          description: "Your new task has been added successfully.",
        });
      } catch (error) {
        console.error("Error adding task:", error);
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive",
        });
      }
    },
    [setTasks, toast]
  );

  const editTask = useCallback(
    (id: string, updatedTask: Partial<Task>) => {
      try {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          )
        );
        toast({
          title: "Task updated",
          description: "The task has been successfully updated.",
        });
      } catch (error) {
        console.error("Error editing task:", error);
        toast({
          title: "Error",
          description: "Failed to edit task. Please try again.",
          variant: "destructive",
        });
      }
    },
    [setTasks, toast]
  );

  const deleteTask = useCallback(
    (id: string) => {
      try {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        toast({
          title: "Task deleted",
          description: "The task has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      }
    },
    [setTasks, toast]
  );

  const toggleTask = useCallback(
    (id: string) => {
      try {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      } catch (error) {
        console.error("Error toggling task:", error);
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
      }
    },
    [setTasks, toast]
  );

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      editTask,
      deleteTask,
      toggleTask,
      filter,
      setFilter,
      assignees,
    }),
    [tasks, addTask, editTask, deleteTask, toggleTask, filter, assignees]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
