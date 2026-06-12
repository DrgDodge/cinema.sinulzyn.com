<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
    
    let isRegister = $state(false);

    function toggleMode(e: Event) {
        e.preventDefault();
        isRegister = !isRegister;
    }
</script>

<svelte:head>
    <title>{isRegister ? 'Register' : 'Login'} - Cinema Wallet</title>
</svelte:head>

<div class="min-h-screen bg-white text-black font-sans flex items-center justify-center p-4 selection:bg-black selection:text-white">
    <div class="max-w-sm w-full">
        
        <div class="mb-10">
            <h2 class="text-2xl font-bold tracking-tight mb-2 text-center">Cinema Wallet</h2>
            <p class="text-gray-500 text-center text-sm">
                {isRegister ? 'Create an account to continue' : 'Sign in to your account'}
            </p>
        </div>
        
        <form method="POST" action={isRegister ? '?/register' : '?/login'} use:enhance class="space-y-4">
            <div>
                <label for="email" class="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    class="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300"
                    placeholder="name@example.com"
                    required
                />
            </div>
            
            <div>
                <label for="password" class="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 mt-6">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    class="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300"
                    placeholder="••••••••"
                    required
                    minlength="8"
                />
            </div>

            {#if isRegister}
                <div class="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label for="passwordConfirm" class="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 mt-6">Confirm Password</label>
                    <input
                        type="password"
                        name="passwordConfirm"
                        id="passwordConfirm"
                        class="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-black focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300"
                        placeholder="••••••••"
                        required
                        minlength="8"
                    />
                </div>
            {/if}

            <div class="pt-4">
                {#if form?.missing}
                    <p class="text-red-500 text-xs mb-4">Please fill out all required fields.</p>
                {/if}
                {#if form?.incorrect && form?.action === 'login'}
                    <p class="text-red-500 text-xs mb-4">Invalid email or password.</p>
                {/if}
                {#if form?.mismatch && form?.action === 'register'}
                    <p class="text-red-500 text-xs mb-4">Passwords do not match.</p>
                {/if}
                {#if form?.error && form?.action === 'register'}
                    <p class="text-red-500 text-xs mb-4">{form?.message || 'Error creating account. Email might be taken.'}</p>
                {/if}

                <button
                    type="submit"
                    class="w-full bg-black hover:bg-gray-800 text-white font-medium rounded-full px-4 py-3.5 transition-colors text-sm"
                >
                    {isRegister ? 'Create Account' : 'Sign In'}
                </button>
            </div>
        </form>

        <div class="mt-8 text-center border-t border-gray-100 pt-6">
            <button type="button" onclick={toggleMode} class="text-sm text-gray-500 hover:text-black transition-colors bg-transparent border-none">
                {isRegister ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
        </div>
    </div>
</div>