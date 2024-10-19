<script setup>
import { ref } from 'vue';

const links = ref([
    { name: 'Home', href: '#Home' },
    { name: 'Community', href: '#Community' },
    { name: 'My Dashboard', href: '#My Dashboard' },
    { name: 'Projects', href: '#Projects' }
]);

</script>

<template>
    <header class="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 class="m-0">Creative Project Planner</h1>
        <nav>
            <ul class="list-none flex gap-4 m-0 p-0">
                <li v-for="link in links" :key="link.name">
                    <a :href="link.href" class="text-white no-underline hover:underline">{{ link.name }}</a>
                </li>
            </ul>
        </nav>
    </header>
</template>
