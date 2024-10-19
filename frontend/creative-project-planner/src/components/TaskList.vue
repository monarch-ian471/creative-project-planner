<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Task List</h2>
        <ul>
            <li v-for="task in tasks" :key="task.id" class="mb-2 p-2 border rounded">
                <div class="flex justify-between items-center">
                    <span>{{ task.name }}</span>
                    <button @click="removeTask(task.id)" class="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                </div>
            </li>
        </ul>
        <div class="mt-4">
            <input v-model="newTask" type="text" placeholder="New Task" class="border p-2 rounded w-full mb-2">
            <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded w-full">Add Task</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tasks: [],
            newTask: ''
        };
    },
    methods: {
        addTask() {
            if (this.newTask.trim() !== '') {
                this.tasks.push({ id: Date.now(), name: this.newTask });
                this.newTask = '';
            }
        },
        removeTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
        }
    }
};
</script>
