"use client";

import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/app/context/TaskContext";
import useDebounce from "../hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FilterTasks: React.FC = () => {
  const { setFilter, assignees } = useTaskContext();
  const [localFilter, setLocalFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const debouncedFilter = useDebounce(localFilter, 300);
  const debouncedAssigneeFilter = useDebounce(assigneeFilter, 300);

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      status: debouncedFilter as "all" | "completed" | "incomplete",
      assignee: debouncedAssigneeFilter,
    }));
  }, [debouncedFilter, debouncedAssigneeFilter, setFilter]);

  return (
    <div className="mb-4 space-y-4 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
      <Tabs
        value={localFilter}
        onValueChange={(value) => setLocalFilter(value)}
        className="w-full sm:w-auto"
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="all"
          >
            All Tasks
          </TabsTrigger>
          <TabsTrigger
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="completed"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="incomplete"
          >
            Incomplete
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="w-full sm:w-1/3">
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {assignees.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default React.memo(FilterTasks);
