<script>
export default {
    name: 'UserSettings',
    methods: {
        updatePassword() {
            // Logic to update password
        },
        updateName() {
            // Logic to update name
        },
        updateHandles() {
            // Logic to update social media handles
        },
        logOut() {
            // Logic to log out
        }
    }
}
</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Settings</h1>
        
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Change Password</h2>
            <input type="password" placeholder="Current Password" class="border p-2 mb-2 w-full" />
            <input type="password" placeholder="New Password" class="border p-2 mb-2 w-full" />
            <input type="password" placeholder="Confirm New Password" class="border p-2 mb-2 w-full" />
            <button class="bg-custom-peach text-white p-2 rounded bg-orange-400">Update Password</button>
        </div>

        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Update Name</h2>
            <input type="text" placeholder="New Name" class="border p-2 mb-2 w-full" />
            <button class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400">Update Name</button>
        </div>

        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Social Media Handles</h2>
            <input type="text" placeholder="Twitter Handle" class="border p-2 mb-2 w-full" />
            <input type="text" placeholder="LinkedIn Handle" class="border p-2 mb-2 w-full" />
            <button class="bg-custom-peach text-white p-2 rounded hover:bg-orange-400">Update Handles</button>
        </div>

        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Account</h2>
            <button class="bg-black text-white p-2 rounded mb-2 hover:bg-gray-400">Log Out</button>
        </div>
    </div>
</template>