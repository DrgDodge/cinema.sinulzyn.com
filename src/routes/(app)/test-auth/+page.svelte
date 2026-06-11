<script lang="ts">
    let { data } = $props();
    const status = data.authStatus;
</script>

<div class="min-h-screen bg-gray-950 text-white p-10 flex flex-col items-center">
    <div class="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <h1 class="text-2xl font-bold mb-6">Auth Diagnostic</h1>
        
        <div class="space-y-4">
            <div class="flex justify-between items-center p-4 bg-gray-950 rounded-xl border border-gray-800">
                <span class="text-gray-400">Is Authenticated?</span>
                <span class={status.isAuthenticated ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {status.isAuthenticated ? "YES" : "NO"}
                </span>
            </div>

            {#if status.isAuthenticated}
                <div class="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <p class="text-xs text-blue-400 uppercase font-bold mb-2">User Details</p>
                    <p class="text-sm"><strong>ID:</strong> {status.user?.id}</p>
                    <p class="text-sm"><strong>Email:</strong> {status.user?.email}</p>
                </div>
                
                <a href="/passes" class="block w-full text-center bg-blue-600 py-3 rounded-xl font-bold mt-4">Go to Wallet</a>
            {:else}
                <div class="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p class="text-sm text-amber-400">You are not logged in. The Svelte server does not see a valid PocketBase session cookie.</p>
                </div>
                <a href="/login" class="block w-full text-center bg-gray-800 py-3 rounded-xl font-bold mt-4">Go to Login</a>
            {/if}
        </div>
    </div>
</div>