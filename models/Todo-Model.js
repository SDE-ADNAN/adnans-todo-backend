const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
        required: true,
    },
    todo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubTodo',
        }
    ],
    status: {
        type: String,
        enum: ['Todo', 'InProgress', 'Completed', 'OnHold'],
        default: 'Todo',
    },
    possibleStatus: {
        type: Object,
        default:{
        Todo:'#fde74c', 
        InProgress:'#41a0ff', 
        Completed:'#74ff53',
        OnHold:'#adadad'}
    },
    possiblePriority: {
        type: Object,
        default:{
        High:'#fd6d4c', 
        Medium:'#fde74c', 
        Low:'#74ff53'}
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
    },
    dueDate: {
        type: Date,
    },
    tags: [
        {
            type: String,
        },
    ],
    attachments: [
        {
            type: String, // Could be a URL or a file path
        },
    ],
    subtasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubTodo',
        },
    ],
    collaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    notes: {
        type: String,
    },
    recurring: {
        type: Boolean,
        default: false,
    },
    estimatedTime: {
        type: Number, // Time in minutes or hours
    },
    actualTimeSpent: {
        type: Number, // Time in minutes or hours
    },
    dependencies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo',
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);







/**
 
Priority: You could add a priority field to indicate the importance of the task. This could be represented as a numerical value or as descriptive terms like "High," "Medium," and "Low."

Due Date: Adding a due date field will help users keep track of when a task needs to be completed. This could be a date-only field or include a time component as well.

Tags/Labels: Allowing users to assign tags or labels to their tasks can help with organization and easy filtering. For example, tags like "Work," "Personal," "Urgent," etc.

Attachments: Providing the ability to attach files or links related to a task can be helpful, especially for tasks that involve documents, images, or external resources.

Subtasks: It looks like you already have a todo array for subtasks. You could enhance this further by allowing users to create hierarchical subtasks, creating a more structured task management system.

Reminders: Integrating a reminder feature that sends notifications or emails to users based on due dates or specific times can be very useful.

Collaborators: If your application supports collaboration, you could add a field for assigning or sharing tasks with other users. This could be an array of user IDs.

Progress Tracking: For tasks that have multiple steps or stages, you could include a field to track the progress, like a percentage completion or a series of checkboxes.

Notes: A text area for users to add additional notes or details about the task can help in providing context.

Recurring Tasks: If users often have tasks that repeat at certain intervals (daily, weekly, monthly), you could add a field to set up recurring tasks.

Estimates: If tasks have time estimates associated with them, you could include fields for estimated time required and actual time spent.

Dependencies: For tasks that are dependent on other tasks being completed first, you could implement a system to link tasks as dependencies.



*/