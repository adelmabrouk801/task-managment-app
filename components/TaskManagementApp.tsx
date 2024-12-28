"use client";

import React from "react";
import { TaskProvider } from "@/app/context/TaskContext";
import AddTask from "./AddTask";
import TaskList from "./TaskList";
import FilterTasks from "./FilterTasks";
import { Toaster } from "@/components/ui/toaster";

const TaskManagementApp: React.FC = () => {
  return (
    <TaskProvider>
      <div className="w-full flex flex-wrap md:flex-nowrap justify-between items-start gap-6 border-2 p-4 pb-8 rounded-xl">
        <AddTask />
        <div className="w-full md:w-2/3 border-2 p-4 rounded-xl mt-4">
          <FilterTasks />
          <TaskList />
        </div>
      </div>
      <Toaster />
    </TaskProvider>
  );
};

export default TaskManagementApp;
