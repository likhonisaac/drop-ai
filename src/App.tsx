import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompletionData, TaskCard } from "./components/TaskCard";
import { NewTaskForm } from "./components/NewTaskForm";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useLocalStorage } from "usehooks-ts";
import posthog from "posthog-js";
export const App: React.FC = () => {
  const tasks = useQuery(api.task.allTasks);
  const [downvotedTasks, _] = useLocalStorage<string[]>("downvotedTasks", []);
  const notCompletedTasks = useMemo(
    () =>
      tasks
        ?.filter((t) => !t.completed)
        .filter((t) => !downvotedTasks.includes(t._id))
        .slice(0)
        .reverse(),
    [tasks, downvotedTasks]
  );
  const updateTaskCompletion = useMutation(api.task.updateTaskCompletion);
  const updateTaskWithAnswer = useMutation(api.task.updateTaskWithAnswer);
  const newTask = useMutation(api.task.createTask);
  const deleteTask = useMutation(api.task.deleteTask);
  const completedTasks = useMemo(
    () =>
      tasks
        ?.filter((t) => t.completed)
        .filter((t) => !downvotedTasks.includes(t._id))
        .slice(0)
        .reverse(),
    [tasks, downvotedTasks]
  );
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto flex flex-col sm:max-w-screen-sm sm:mx-auto sm:p-8 p-4">
      <Tabs
        defaultValue="todo"
        className="w-full flex-grow flex flex-col min-h-0 overscroll-contain"
      >
        <TabsList className="grid w-full grid-cols-2 select-none">
          <TabsTrigger value="todo">Quests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="todo" className="flex-grow min-h-0 overflow-y-auto">
          {notCompletedTasks ? (
            notCompletedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={(_: string, data: CompletionData) => {
                  posthog.capture("task_completed", {
                    taskId: task._id,
                    completionData: data,
                  });
                  updateTaskCompletion({ id: task._id });
                  updateTaskWithAnswer({
                    id: task._id,
                    answer: data.notes,
                  });
                }}
                onDownvote={async () => {
                  await deleteTask({ id: task._id });
                }}
              />
            ))
          ) : (
            <div>No tasks</div>
          )}
        </TabsContent>
        <TabsContent
          value="completed"
          className="flex-grow min-h-0 overflow-y-auto"
        >
          {completedTasks ? (
            completedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                completed
                onComplete={() => {}}
                onDownvote={async () => {
                  await deleteTask({ id: task._id });
                }}
              />
            ))
          ) : (
            <div>No tasks</div>
          )}
        </TabsContent>
      </Tabs>
      <div>
        <Dialog open={isNewTaskModalOpen} onOpenChange={setIsNewTaskModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full select-none mt-2">New Quest</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Quest</DialogTitle>
            </DialogHeader>
            <NewTaskForm
              onSubmit={(taskData) => {
                newTask({
                  title: taskData.title,
                  description: taskData.description,
                  requester: taskData.requester,
                  location: taskData.location,
                  timeEstimate: taskData.timeEstimate,
                  sizeEstimate: taskData.sizeEstimate,
                });
              }}
              onClose={() => setIsNewTaskModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
