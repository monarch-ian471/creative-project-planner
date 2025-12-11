<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold">Welcome to Creative Project Planner</h1>
            </div>
            <div>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuthLayout',
};
</script>
