"use client";

import React, { useState, useCallback } from "react";
import { useTaskContext, Task } from "@/app/context/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Save, X, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { format, parseISO } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { editTask, deleteTask, toggleTask, assignees } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = useCallback(() => {
    if (editedTask.title.trim()) {
      editTask(task.id, editedTask);
      setIsEditing(false);
    }
  }, [editTask, task.id, editedTask]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (
    dateType: "startDate" | "endDate",
    date: Date | undefined
  ) => {
    setEditedTask((prev) => ({
      ...prev,
      [dateType]: date ? date.toISOString() : null,
    }));
  };

  return (
    <li className="bg-card rounded-md shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            id={`task-${task.id}`}
          />

          {isEditing ? (
            <Input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              className="flex-grow"
              autoFocus
            />
          ) : (
            <label
              htmlFor={`task-${task.id}`}
              className={`${
                task.completed ? "line-through text-muted-foreground" : ""
              } text-sm md:text-lg font-semibold`}
            >
              {task.title}
            </label>
          )}
        </div>
        <div className="flex space-x-2">
          <div></div>
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isEditing ? (
        <>
          <Textarea
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            placeholder="Task description"
            className="w-full mb-2"
          />
          <Select
            value={editedTask.assignee || "unassigned"}
            onValueChange={(value) =>
              setEditedTask((prev) => ({ ...prev, assignee: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {assignees.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex space-x-2 mt-2">
            <div className="flex flex-row w-full items-center justify-between">
              <Label htmlFor="startDate">Start Date</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !editedTask.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {editedTask.startDate ? (
                      format(new Date(editedTask.startDate), "PPP")
                    ) : (
                      <span>Pick a Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      editedTask.startDate
                        ? new Date(editedTask.startDate)
                        : undefined
                    }
                    onSelect={(date) => handleDateChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-row w-full items-center justify-between">
              <Label htmlFor="endDate">Due Date</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !editedTask.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {editedTask.endDate ? (
                      format(new Date(editedTask.endDate), "PPP")
                    ) : (
                      <span>Pick a Due Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      editedTask.endDate
                        ? new Date(editedTask.endDate)
                        : undefined
                    }
                    onSelect={(date) => handleDateChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </>
      ) : (
        <div className="flex  md:flex-row justify-between md:items-end items-center flex-col ">
          <div className="flex flex-col justify-between ">
            <p className="text-muted-foreground mb-2">{task.description}</p>
            <p className="text-sm">Assignee: {task.assignee}</p>
            <p className="text-sm">
              Start Date:
              {editedTask.startDate
                ? format(parseISO(editedTask.startDate), "PPP")
                : "Not set"}
            </p>
            <p className="text-sm">
              Due Date:
              {editedTask.startDate
                ? format(parseISO(editedTask.endDate), "PPP")
                : "Not set"}
            </p>
          </div>{" "}
          <Button
            variant={task.completed ? "secondary" : "outline"}
            size="sm"
            onClick={() => toggleTask(task.id)}
            className="mt-2 w-full md:w-auto"
          >
            {task.completed ? "Mark as Pending" : "Mark as Completed"}
          </Button>
        </div>
      )}
    </li>
  );
};

export default React.memo(TaskItem);
