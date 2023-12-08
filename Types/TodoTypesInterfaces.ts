export default interface TodoItem {
    attachments: any[]; // You can specify the actual type for attachments if needed
    collaborators: any[]; // You can specify the actual type for collaborators if needed
    createdAt: string;
    dependencies: any[]; // You can specify the actual type for dependencies if needed
    description: string;
    priority: string;
    progress: number;
    recurring: boolean;
    status: string;
    subtasks: any[]; // You can specify the actual type for subtasks if needed
    tags: any[]; // You can specify the actual type for tags if needed
    title: string;
    todo: any[]; // You can specify the actual type for todo if needed
    updatedAt: string;
    user: string;
    ObjectId:string;
    __v: number;
    _id: string;
}