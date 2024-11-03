import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
export const allTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const completedTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();
  },
});

export const updateTaskCompletion = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.patch(id, { completed: true });
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    requester: v.string(),
    location: v.string(),
    timeEstimate: v.number(),
    sizeEstimate: v.string(),
  },
  handler: async (ctx, args) => {
    const {
      title,
      description,
      requester,
      location,
      timeEstimate,
      sizeEstimate,
    } = args;
    return await ctx.db.insert("tasks", {
      title,
      description,
      completed: false,
      requester,
      location,
      timeEstimate,
      sizeEstimate,
    });
  },
});

export const updateTaskWithAnswer = mutation({
  args: { id: v.id("tasks"), answer: v.string() },
  handler: async (ctx, args) => {
    const { id, answer } = args;
    await ctx.db.patch(id, { answer });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
  },
});
