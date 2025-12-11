export interface IEntity {
    id: string;
    created?: string;
    deleted?: string;
    updated?: string;
    status?: 'active' | 'inactive' | 'deleted';
}

export interface IEntityCount {
    count: number;
}

export interface IUser extends IEntity {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    role: 'admin' | 'user' | 'guest';
}

export interface IProject extends IEntity {
    title: string;
    description: string;
    ownerId: string;
    members: string[];
    dueDate?: string;
}

export interface ITask extends IEntity {
    title: string;
    description: string;
    projectId: string;
    assigneeId: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
}

export interface IComment extends IEntity {
    content: string;
    authorId: string;
    taskId: string;
}