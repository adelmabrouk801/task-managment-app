"use client";

import React, { useMemo } from "react";
import { useTaskContext } from "@/app/context/TaskContext";
import TaskItem from "./TaskItem";

const TaskList: React.FC = () => {
  const { tasks, filter } = useTaskContext();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch =
        filter.status === "all" ||
        (filter.status === "completed" && task.completed) ||
        (filter.status === "incomplete" && !task.completed);
      const assigneeMatch =
        filter.assignee === "all" || task.assignee === filter.assignee;
      const dateMatch =
        !filter.date ||
        task.startDate === filter.date ||
        task.endDate === filter.date;
      return statusMatch && assigneeMatch && dateMatch;
    });
  }, [tasks, filter]);

  return (
    <ul className="space-y-4 w-full">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <li className="text-center text-muted-foreground">No tasks found</li>
      )}
    </ul>
  );
};

export default React.memo(TaskList);
