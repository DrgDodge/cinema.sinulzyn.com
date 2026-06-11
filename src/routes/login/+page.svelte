<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
</script>

<svelte:head>
    <title>Login - Cinema Wallet</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800 relative overflow-hidden">
        
        <!-- Decorative Glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/20 blur-[50px] pointer-events-none"></div>

        <h2 class="text-3xl font-bold text-white mb-8 text-center tracking-tight">Cinema Wallet</h2>
        
        <form method="POST" use:enhance class="space-y-5">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={form?.email ?? ''}
                    class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="Enter your email"
                    required
                />
            </div>
            
            <div>
                <label for="password" class="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                />
            </div>

            {#if form?.missing}
                <p class="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">Please provide both email and password.</p>
            {/if}
            {#if form?.incorrect}
                <p class="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">Invalid email or password.</p>
            {/if}

            <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-4 py-3 mt-4 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
            >
                Sign In
            </button>
        </form>
    </div>
</div>