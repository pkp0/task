import { defineStore } from 'pinia';
import { Member } from '~/stores/members';
import { priorityEnum, statusesEnum } from '~/stores/utils';

export interface Task {
    id: number;
    title: string;
    description: string;
    responsible: Member;
    members: Member[];
    priority: priorityEnum;
    status: statusesEnum;
}

interface TasksState {
    tasks: Task[];
}

export const useTasksStore = defineStore('tasks', {
    state: (): TasksState => ({
        tasks: [],
    }),

    actions: {
        addTask(task: Omit<Task, 'id'>) {
            this.tasks.push({ ...task, id: Date.now() });
        },

        task(id: number) {
            return this.tasks.find(task => task.id === id);
        },

        updateTask(updatedTask: Task) {
            const index = this.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
            }
        },

        updateTaskStatus(taskId: number, newStatus: statusesEnum) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.status = newStatus;
            }
        },

        deleteTask(taskId: number) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        },
    },
});
