<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white">
        <div class="font-bold text-xl mb-2">{{ project.title }}</div>
        <p class="text-gray-700 text-base">
            {{ project.description }}
        </p>
        <div class="mt-4">
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {{ project.status }}
            </span>
            <button @click="changeStatus" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Change Status
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProjectCard',
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    methods: {
        changeStatus() {
            // Logic to change the project status
            this.$emit('change-status', this.project);
        }
    }
}
</script>